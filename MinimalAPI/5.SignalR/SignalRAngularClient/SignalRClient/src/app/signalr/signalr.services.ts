import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  [x: string]: any;

  private hubConnection?: signalR.HubConnection;

  messages: string[] = [];

  startConnection() {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7071/hubs/chat')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR ansluten'))
      .catch(err => console.error(err));
  }

  sendMessage(user: string, message: string) {
    this.hubConnection?.invoke(
      'SendMessage',
      user,
      message
    );
  }

  onMessage(callback: (user: string, message: string) => void) {
  this.hubConnection?.on('ReceiveMessage', callback);
}

  receiveMessages() {

    this.hubConnection?.on(
      'ReceiveMessage',
      (user, message) => {

        console.log(`${user}: ${message}`);
      });
  }
}