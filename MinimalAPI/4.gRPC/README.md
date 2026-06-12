Här är en sammanfattning i markdown-format för hur du sätter upp ett gRPC i ASP.NET Core, insamlat från **Chat GPT, Gemini** kontrollerat med **Perplexity** och sammanställt til md-fil av **ChatGPT**:
<br>
# Sätta upp ett gRPC i ASP.NET Core

## Vad är gRPC?
gRPC (General Remote Procedure Call) är en högpresterande RPC (Remote Procedure Call) framework utvecklad av Google som använder Protocol Buffers (protobuf) för dataserialization och HTTP/2 för kommunikation.

## Förutsättningar
- **.NET 8 SDK** eller senare (rec. .NET 9)
- **Visual Studio 2022** med "ASP.NET and web development" workload ELLER **Visual Studio Code** med C# Dev Kit
- **HTTPS development certificate** installerat och tilltruster

## Steg 1: Skapa gRPC-projekt

### Visual Studio Code / Terminal
```bash
dotnet new grpc -o GrpcGreeter
cd GrpcGreeter
```
Detta skapar en ny gRPC service med templaten.

### Visual Studio
1. Välj **New Project**
2. Sök efter `gRPC`
3. Välj **ASP.NET Core gRPC Service**
4. Projektnamn: `GrpcGreeter`
5. Framework: **.NET 9.0** eller **.NET 8.0**

## Steg 2: Projektstruktur
```
GrpcGreeter/
├── Protos/
│ └── greet.proto # Protobuf-definition
├── Services/
│ └── GreeterService.cs # gRPC-service implementation
├── Program.cs # Entry point
├── appsettings.json # Konfiguration
└── GrpcGreeter.csproj # Projektfil
```
[web:11][web:17]

## Steg 3: Examinera .proto-fil
Öppna `Protos/greet.proto`:

```protobuf
syntax = "proto3";

option csharp_namespace = "GrpcGreeter";

package greet;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply);
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

Denna fil definierar gRPC-service och används för att generera server-assets.

## Steg 4: gRPC-service Implementation
Öppna `Services/GreeterService.cs`:

```csharp
using Grpc.Core;
using Greeter;

namespace GrpcGreeter.Services;

public class GreeterService : Greeter.GreeterBase
{
    private readonly ILogger<GreeterService> _logger;

    public GreeterService(ILogger<GreeterService> logger)
    {
        _logger = logger;
    }

    public override Task<HelloReply> SayHello(
        HelloRequest request, ServerCallContext context)
    {
        _logger.LogInformation("Saying hello to {Name}", request.Name);
        return Task.FromResult(new HelloReply
        {
            Message = "Hello " + request.Name
        });
    }
}
```

**Förklaring:**
- `Greeter.GreeterBase` – Genererad basklass från .proto-fil
- `ServerCallContext` – Ger tillgång till HTTP/2 data
- Dependency injection för `ILogger`

## Steg 5: Konfigurera gRPC i Program.cs
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add gRPC services
builder.Services.AddGrpc();

var app = builder.Build();

// Map gRPC service
app.MapGrpcService<GreeterService>();

app.Run();
```

**Förklaring:**
- `AddGrpc()` – Aktiverar gRPC i DI-container
- `MapGrpcService<GreeterService>()` – Lägger till service i routing-pipeline

## Steg 6: Trust HTTPS-certifikat (Viktigt!)
```bash
dotnet dev-certs https --trust
```
gRPC använder TLS som standard. Clients behöver HTTPS för att anropa servern

## Steg 7: Kör service
```bash
dotnet run
```

Du ser:
```
Now listening on: https://localhost:7042
Application started. Press Ctrl+C to shut down.
```

Portnummer (t.ex. 7042) är randomiserat och visas i `Properties/launchSettings.json`.

## Steg 8: Testa gRPC-client

### Skapa client-projekt
```bash
dotnet new console -o GrpcGreeterClient
cd GrpcGreeterClient
```

### Installera NuGet-packages
```bash
dotnet add GrpcGreeterClient.csproj package Grpc.Net.Client
dotnet add GrpcGreeterClient.csproj package Google.Protobuf
dotnet add GrpcGreeterClient.csproj package Grpc.Tools
```

**Packages:**
- `Grpc.Net.Client` – .NET Core client
- `Google.Protobuf` – Protobuf message APIs
- `Grpc.Tools` – Tooling för .proto-filer (endast development)

### Kopiera .proto-fil
```bash
mkdir Protos
copy Protos\greet.proto Protos\greet.proto
```

Uppdatera namespace i `Protos/greet.proto`:
```protobuf
option csharp_namespace = "GrpcGreeterClient";
```

### Uppdatera GrpcGreeterClient.csproj
```xml
<ItemGroup>
  <Protobuf Include="Protos\greet.proto" GrpcServices="Client" />
</ItemGroup>
```
### Skapa client i Program.cs
```csharp
using Grpc.Net.Client;
using GrpcGreeterClient;

// Port måste matcha serverns port
using var channel = GrpcChannel.ForAddress("https://localhost:7042");
var client = new Greeter.GreeterClient(channel);

var reply = await client.SayHelloAsync(
    new HelloRequest { Name = "GreeterClient" });

Console.WriteLine("Greeting: " + reply.Message);
```

Uppdatera porten `7042` till din serverns HTTPS-port från `launchSettings.json`.

### Kör client
```bash
dotnet run
```

Resultat:
```
Greeting: Hello GreeterClient
Press any key to exit...
```

## viktiga punkter om gRPC i ASP.NET Core

### HTTP/2 krav
- gRPC **kräver HTTP/2**
- Kestrel supportar HTTP/2 på moderna operativsystem

### TLS krav
- gRPC endpoints **måste** vara secured med TLS
- Utvecklning: TLS-endpoint skapas automatiskt vid `https://localhost:5001`
- Produktion: TLS måste konfigureras explicit

### Kestrel konfigurera för HTTP/2 + TLS
`appsettings.json`:
```json
{
  "Kestrel": {
    "Https": {
      "Url": "https://localhost:6000",
      "Protocols": "Http2"
    }
  }
}
```
[web:16]

## Ytterligare funktioner

### Streaming
gRPC supportar:
- **Unary** (standard) – En request, en response
- **Server streaming** – En request, multiple responses
- **Client streaming** – Multiple requests, en response
- **Duplex streaming** – Multiple requests och responses

### gRPC-Web (för browser)
```csharp
// Install: Grpc.AspNetCore.Web
app.UseGrpcWeb();
endpoints.MapGrpcService<GreeterService>().EnableGrpcWeb();
```

### Dependency Injection
gRPC services har full access till ASP.NET Core DI:
```csharp
public class GreeterService(ILogger<GreeterService> logger) 
    : Greeter.GreeterBase
{
    // Primary constructor (.NET 8+)
}
```

gRPC är idealisk för back-to-back kommunikation mellan microservices.
