import { Component, OnInit } from '@angular/core';
import { SignalrService } from './signalr.services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signalr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signalr.html',
  styleUrl: './signalr.css',
})
export class Signalr implements OnInit {
send() {

  
  this.signalr.sendMessage('AngularClient', 'Hej från Angular!');
  // this.signalr.receiveMessages();
  
    this.signalr.onMessage((user, message) => {
    // this.messages.push(`${user}: ${message}`);
    this.messages = [`${user}: ${message}`];
});

}
messages: any;

  constructor(private signalr: SignalrService) {}

  ngOnInit(): void {    
    this.messages = [];
    this.signalr.startConnection();
    this.signalr.receiveMessages();
  }
}