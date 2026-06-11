using Grpc.Net.Client;
using GrpcServiceMinimalAPI;

namespace gRPC_Client
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            var channel = GrpcChannel.ForAddress("https://localhost:7071");

            var client = new Greeter.GreeterClient(channel);

            var reply = await client.SayHelloAsync(
                new HelloRequest {
                    Name = "Lars"
                });

            Console.WriteLine(reply.Message);
        }
    }
}
