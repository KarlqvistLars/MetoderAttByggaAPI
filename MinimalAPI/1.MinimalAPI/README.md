# Sätta upp ett Minimal API i ASP.NET Core

## Vad är ett Minimal API?
Minimal APIs är en lättviktig approach för att bygga HTTP-API'er med ASP.NET Core. De är designade för att vara enkla och lightweight med minimala filer och dependencies [web:2][web:10].

## Förutsättningar
- **.NET 8 SDK** (eller senare) installerat [web:2]
- **Code Editor**: Visual Studio Code eller Visual Studio 2022 [web:2]

## Steg 1: Skapa nytt projekt
```bash
dotnet new web -n MyFirstMinimalApi
```
Detta skapar en ny ASP.NET Core-projektmapp [web:2].

## Steg 2: Navigera till projektet
```bash
cd MyFirstMinimalApi
```

## Steg 3: Uppdatera Program.cs
Öppna `Program.cs` och ersätt innehållet med:

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Welcome to your first Minimal API!");

app.Run();
```

**Förklaring:**
- `WebApplication.CreateBuilder(args)` – Initierar byggaren för webbcerationen [web:2]
- `app.MapGet("/", ...)` – Definierar GET-endpoint vid root URL [web:2]
- `app.Run()` – Kör applikationen [web:2]

## Steg 4: Kör API-et
```bash
dotnet run
```

Du ser då output:
```
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

[web:2]

## Steg 5: Testa i browser
Öppna `http://localhost:5000` – du ser "Welcome to your first Minimal API!" [web:2]

## Tillägga fler endpoints

### GET med route-parameter
```csharp
app.MapGet("/hello/{name}", (string name) => $"Hello, {name}!");
```
Testa: `http://localhost:5000/hello/John` → "Hello, John!" [web:2]

### JSON-response
```csharp
app.MapGet("/person", () => new { Name = "John Doe", Age = 30 });
```
Returnerar:
```json
{
  "Name": "John Doe",
  "Age": 30
}
```
[web:2]

### POST, PUT, DELETE
```csharp
app.MapPost("/items", (string item) => $"Created: {item}");
app.MapPut("/items/{id}", (int id, string item) => $"Updated {id}: {item}");
app.MapDelete("/items/{id}", (int id) => $"Deleted {id}");
```
[web:2][web:10]

## Ytterligare funktioner
- **Authorization**: `.RequireAuthorization()` för att säkra endpoints [web:3]
- **Endpoint-gruppering**: `app.MapGroup("/api")` för att organisera routes [web:9]
- **Authentication/JWT**: `builder.Services.AddAuthentication()` [web:3]

Minimal APIs är idealiska för microservices och applikationer som vill inkludera endast minimum av files, features och dependencies [web:5].