# Sätta upp ett Minimal API i ASP.NET Core

## Vad är ett Minimal API?
Minimal APIs är en lättviktig approach för att bygga HTTP-API'er med ASP.NET Core. De är designade för att vara enkla och lightweight med minimala filer och dependencies.

## Förutsättningar
- **.NET 8 SDK** (eller senare) installerat
- **Code Editor**: Visual Studio Code eller Visual Studio 2022

## Steg 1: Skapa nytt projekt
```bash
dotnet new web -n MyFirstMinimalApi
```
Detta skapar en ny ASP.NET Core-projektmapp.

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
- `WebApplication.CreateBuilder(args)` – Initierar byggaren för webbcerationen
- `app.MapGet("/", ...)` – Definierar GET-endpoint vid root URL
- `app.Run()` – Kör applikationen

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
Öppna `http://localhost:5000` – du ser "Welcome to your first Minimal API!"

## Tillägga fler endpoints

### GET med route-parameter
```csharp
app.MapGet("/hello/{name}", (string name) => $"Hello, {name}!");
```
Testa: `http://localhost:5000/hello/John` → "Hello, John!"

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

## Ytterligare funktioner
- **Authorization**: `.RequireAuthorization()` för att säkra endpoints
- **Endpoint-gruppering**: `app.MapGroup("/api")` för att organisera routes
- **Authentication/JWT**: `builder.Services.AddAuthentication()`

Minimal APIs är idealiska för microservices och applikationer som vill inkludera endast minimum av files, features och dependencies.
