
namespace MinimalAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var app = builder.Build();
            app.MapGet("/hello", () => "Hej från Minimal API!");
            app.MapGet("/hello/{name}", (string name) => $"Hej {name}!");

            app.Run();
        }
    }
}
