import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as XMPP from 'stanza';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  passwd: string;
  jid: string;
  message: string;
  to: string;
  conn: any;

  public credForm = new FormGroup({
    jid: new FormControl(''),
    passwd: new FormControl('')
  });

  public messageForm = new FormGroup({
    to: new FormControl(''),
    message: new FormControl('')
  });

  public connectXmpp() {
    this.jid = this.credForm.get('jid').value.trim();
    this.passwd = this.credForm.get('passwd').value.trim();

    this.conn = XMPP.createClient({
      jid: this.jid,
      password: this.passwd,
      transport: 'websocket',
      wsURL: 'ws://localhost:5280/ws-xmpp',
    });

    this.conn.on('chat', this.onMessage);

    this.conn.connect();
  }

  public sendMessage() {
    this.message = this.messageForm.get('message').value.trim();
    this.to = this.messageForm.get('to').value.trim();

    if (this.message && this.to) {
      this.conn.sendMessage({
        to: this.to,
        body: this.message
      });

      console.log('sent ' + this.to + ': ' + this.message);
    }
  }

  private onMessage(msg) {
    console.log(msg);
  }
}
