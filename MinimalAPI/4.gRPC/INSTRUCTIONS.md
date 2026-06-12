Öppna både gRPC_Client och GrpcServiceMinimalAPI i Visual Studio el. Code?
Se till att de går att bygga med build.

Starta ServerAPI enlklast från Visual studio:

Kör filen gRPC_Client.exe från:
cd \MetoderAttByggaAPI\MinimalAPI\4.gRPC\gRPC_Client\gRPC_Client\bin\Debug\net10.0\
.\gRPC_Client.exe

Då skall svaret bli:

Hej Lars! då Namn hämtas från funktionen SayHelloAsync();

```
            var reply = await client.SayHelloAsync(
                new HelloRequest {
                    Name = "Lars"
                });
```

```
API-endpoints:
• GET /ping → Minimal API
• GET /minimal/test → Minimal API
• GET /api/test → Controller
```