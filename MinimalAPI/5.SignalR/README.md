Här är en sammanfattning i markdown-format för hur du sätter upp ett SignalR i ASP.NET Core:

# Sätta upp ett SignalR i ASP.NET Core

## Vad är SignalR?
SignalR är en open-source library för ASP.NET som förenklar real-time kommunikation mellan server och klient. Det tillåter server-side code att push content till connected clients instantaneously [web:21][web:23].

### Nyckelfunktioner
| Funktion | Beskrivning |
|----------|-------------|
| **Real-time Communication** | Bi-directional kommunikation mellan server och klient [web:23] |
| **Automatic Reconnection** | Automatisk reconnect om connection falls [web:23] |
| **Multiple Transport Options** | Väljer bästa transport (WebSockets, Server-Sent Events, Long Polling) [web:23] |
| **Connection Management** | Hanterar connections automatiskt och scale ut för stora antal [web:23] |

## Förutsättningar
- **.NET 8 SDK** eller senare [web:21][web:22]
- **Visual Studio 2022** eller **Visual Studio Code** med C# Dev Kit [web:21]
- **HTTPS development certificate** (rekommenderat för development) [web:21]

## Steg 1: Skapa nytt projekt

### Visual Studio Code / Terminal (Web API)
```bash
dotnet new webapi -n RealTimeApp
cd RealTimeApp
```
[web:22][web:24]

### Visual Studio Code / Terminal (Razor Pages)
```bash
dotnet new webapp -o SignalRChat
cd SignalRChat
```
[web:21]

### Visual Studio
1. Välj **New Project**
2. Sök efter **ASP.NET Core Web App (Razor Pages)** ELLER **Web API**
3. Projektnamn: `SignalRChat` (viktigt! case-sensitive för namespaces) [web:21]
4. Framework: **.NET 8.0** eller **.NET 9.0**
5. **Create**

## Steg 2: Installera SignalR NuGet Package

```bash
dotnet add package Microsoft.AspNetCore.SignalR
```
[web:22][web:24]

**Obs:** SignalR server library är inkluderat i ASP.NET Core shared framework, så package är oftast inte nödvändigt för senare .NET versioner [web:21].

## Steg 3: Skapa SignalR Hub

### Skapa Hubs-folder
```bash
mkdir Hubs
```
[web:21]

### Skapa ChatHub.cs
Öppna `Hubs/ChatHub.cs` och skapa:

```csharp
using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs;

public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
```

**Förklaring:**
- `Hub` – Base class som hanterar connections, groups och messaging [web:21][web:22]
- `Clients.All.SendAsync()` – Skicka till ALLA connected clients [web:22][web:23]
- `"ReceiveMessage"` – Event name som clients lyssnar på [web:22][web:23]
- Asynchronous för maximera scalability [web:21]

### Alternativ: Bättre Hub med flere funktioner
```csharp
using Microsoft.AspNetCore.SignalR;

namespace RealTimeApp.Hubs;

public class RealTimeHub : Hub
{
    // Skicka till ALLA clients
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    // Skicka notification till ALLA
    public async Task SendNotification(string message)
    {
        await Clients.All.SendAsync("ReceiveNotification", message);
    }

    // Skicka till ENDAST upphandlande client
    public async Task SendToSelf(string message)
    {
        await Clients.Caller.SendAsync("ReceiveSelf", message);
    }

    // Skicka till SPECIFIK client (utan clientId)
    public async Task SendMessageToUser(string userName, string message)
    {
        await Clients.User(userName).SendAsync("ReceiveMessage", userName, message);
    }
}
```
[web:22]

## Steg 4: Registrera SignalR i Program.cs

### För .NET 6+ (Program.cs approach)
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add SignalR services
builder.Services.AddSignalR();

// Add controllers (om du använder API)
builder.Services.AddControllers();

var app = builder.Build();

// Map controllers
app.MapControllers();

// Map SignalR Hub
app.MapHub<ChatHub>("/chatHub");

app.Run();
```

**Förklaring:**
- `AddSignalR()` – Registrerar SignalR services i DI-container [web:21][web:22]
- `MapHub<ChatHub>("/chatHub")` – Lägger till hub endpoint vid `/chatHub` [web:21][web:22]

### För .NET 5 / older (Startup.cs approach)
```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddSignalR();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHub<RealTimeHub>("/realtimehub");
        });
    }
}
```
[web:22][web:27]

## Steg 5: Skapa JavaScript Client

### Skapa Index.cshtml (Razor Pages)
Öppna `Pages/Index.cshtml` och ersätt med:

```html
@page
@model SignalRChat.Pages.IndexModel
@{
    ViewData["Title"] = "SignalR Chat";
}

<h1>SignalR Chat</h1>

<div>
    <input type="text" id="userInput" placeholder="Namn" />
    <input type="text" id="messageInput" placeholder="Meddelande" />
    <button id="sendButton" onclick="sendMessage()">Skicka Meddelande</button>
</div>

<ul id="messagesList"></ul>

<!-- Include SignalR client library -->
<script src="~/js/signalr/dist/browser/signalr.js"></script>
<script src="~/js/chat.js"></script>
```
[web:21]

### Skapa chat.js
I `wwwroot/js/chat.js`:

```javascript
// Create connection to SignalR hub
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")  // Matching hub path från Program.cs
    .build();

// Add handler for receiving messages
connection.on("ReceiveMessage", (user, message) => {
    const li = document.createElement("li");
    li.textContent = `${user}: ${message}`;
    document.getElementById("messagesList").appendChild(li);
});

// Start connection
connection.start()
    .then(() => {
        console.log("Connected to SignalR hub");
    })
    .catch(err => {
        console.error("SignalR connection error:", err);
    });

// Send message function
function sendMessage() {
    const user = document.getElementById("userInput").value;
    const message = document.getElementById("messageInput").value;
    
    connection.invoke("SendMessage", user, message)
        .catch(err => {
            console.error("Error sending message:", err);
        });
}
```

**Förklaring:**
- `HubConnectionBuilder()` – Skapar SignalR connection [web:21][web:23]
- `.withUrl("/chatHub")` – Hub endpoint path (måste matcha `MapHub`) [web:21][web:23]
- `connection.on()` – Lyssnar på event från server [web:21][web:23]
- `connection.invoke()` – Skicka method call till hub [web:21][web:23]

## Steg 6: Installera SignalR Client Library

### Visual Studio (LibMan)
1. **Solution Explorer** → Right-click project → **Add** > **Client-Side Library**
2. Dialog:
   - **Provider**: `unpkg`
   - **Library**: `@microsoft/signalr@latest`
   - **Choose specific files**: `dist/browser/signalr.js` och `dist/browser/signalr.min.js`
   - **Target Location**: `wwwroot/js/signalr/`
   - **Install**

LibMan skapar `wwwroot/js/signalr` folder och kopierar filer [web:21].

### Visual Studio Code (Terminal)
```bash
# Install LibMan tool (om inte installerat)
dotnet tool uninstall -g Microsoft.Web.LibraryManager.Cli
dotnet tool install -g Microsoft.Web.LibraryManager.Cli

# Install SignalR client
libman install @microsoft/signalr@latest -p unpkg -d wwwroot/js/signalr --files dist/browser/signalr.js
```

Output:
```
Downloading file https://unpkg.com/@microsoft/signalr@latest/dist/browser/signalr.js...
wwwroot/js/signalr/dist/browser/signalr.js written to disk
Installed library "@microsoft/signalr@latest" to "wwwroot/js/signalr"
```
[web:21]

### Alternativ: CDN (Efterfilt)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/5.0.11/signalr.min.js"></script>
```
[web:22]

## Steg 7: Trust HTTPS-certifikat (Om du får TLS-error)

```bash
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

Om du får `ERR_SPDY_INADEQUATE_TRANSPORT_SECURITY` i Chrome, kör dessa commands [web:21].

## Steg 8: Kör Application

### Visual Studio
- Ctrl+F5 (run utan debugging)

### Terminal
```bash
dotnet run
```

Du ser:
```
Now listening on: https://localhost:5001
Application started. Press Ctrl+C to shut down.
```
[web:22]

## Steg 9: Testa Application

1. **Öppna URL** från address bar i browser
2. **Kopiera URL** och öppna **annan browser/tab**
3. **Enter namn och meddelande** → **Send Message**
4. **Resultat**: Namn och meddelande visas på **BÅDA sidor instantly** [web:21]

### Testa i två terminaler (Console Client)
```bash
# Kör server
cd SignalRServer
dotnet run

# Kör client i ny terminal
cd SignalRClient
dotnet run
```

Type namn och meddelande i console → Meddelande echo tillbaka från hub [web:24].

## Ytterligare funktioner

### Groups (Skicka till specifika användare)
```csharp
public class ChatHub : Hub
{
    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Group(groupName).SendAsync("GroupMessage", $"{Context.ConnectionId} joined");
    }

    public async Task SendMessageToGroup(string groupName, string message)
    {
        await Clients.Group(groupName).SendAsync("GroupMessage", message);
    }
}
```
[web:22]

### Authentication & Authorization
```csharp
// Add to Program.cs
builder.Services.AddAuthentication()
    .AddBearerToken(AuthenticationSchemeNames.HttpBearerToken);

builder.Services.AddSignalR()
    .AddAuthorizationPolicy("SignalRPolicy");

app.MapHub<ChatHub>("/chatHub", builder =>
{
    builder.RequireAuthorization("SignalRPolicy");
});
```
[web:22]

### Client-side: Skicka till ENDAST caller
```javascript
connection.on("ReceiveSelf", (message) => {
    console.log("Self message:", message);
});

connection.invoke("SendToSelf", "Hello to myself!")
    .catch(err => console.error(err));
```
[web:22]

### Error Handling
```javascript
connection.onclose((error) => {
    console.error("Connection closed:", error);
    // Manual reconnect
    connection.start().catch(err => console.error(err));
});
```

### Azure SignalR Service
För production med multiple servers, använd **Azure SignalR Service**:
```csharp
builder.Services.AddSignalR().AddAzureSignalR();
```
[web:21]

SignalR är idealisk för live chat, real-time notifications, och dynamic dashboards [web:22][web:23].