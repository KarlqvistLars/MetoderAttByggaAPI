using Microsoft.AspNetCore.SignalR;

namespace SignalRApi.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            Console.WriteLine(message);
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
