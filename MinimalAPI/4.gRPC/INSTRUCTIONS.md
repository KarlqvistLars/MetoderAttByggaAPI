Öppna både gRPC_Client och GrpcServiceMinimalAPI i Visual Studio el. Code?
Se till att de går att bygga med build.

Starta ServerAPI enlklast från Visual studio:

Kör filen gRPC_Client.exe från:
cd \MetoderAttByggaAPI\MinimalAPI\4.gRPC\gRPC_Client\gRPC_Client\bin\Debug\net10.0\
.\gRPC_Client.exe

<<<<<<< HEAD
Då skall svaret bli:

Hej Lars!<br> då Namn hämtas från funktionen SayHelloAsync();
=======
Då skall svaret bli: **Hello Lars** <br> då Namn hämtas från funktionen SayHelloAsync();
>>>>>>> 238d682813f8f5514c3eeb170b5b306d73e13f8a

```
var reply = await client.SayHelloAsync(
    new HelloRequest {
         Name = "Lars"
    });
```
Granska koden för att förstå hur den fungerar.
