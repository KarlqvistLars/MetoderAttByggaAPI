import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
    .withUrl('/hubs/chat')
    .build();

connection.on("ReceiveMessage", (user, message) => {
  console.log(`${user}: ${message}`);
});

await connection.start();

await connection.invoke("SendMessage", "Lars", "Hej från klienten!");