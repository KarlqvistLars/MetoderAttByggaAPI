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
  signalCount:number = 0;
  messages: string[] = [];

  send() {
    ++this.signalCount;
    this.signalr.sendMessage('AngularClient', `Sänder meddelande nr: ${this.signalCount} från Angular`);
    this.signalr.onMessage((user, message) => {
      this.messages = [`${user}: ${message}`];
    });
    
  }
  
  constructor(private signalr: SignalrService) {}
  
  ngOnInit(): void {    
    this.messages = [];
    this.signalr.startConnection();
    this.signalr.receiveMessages();
  }
}