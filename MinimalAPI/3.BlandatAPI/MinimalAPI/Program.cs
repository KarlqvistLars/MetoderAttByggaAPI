
namespace MinimalAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();
            var app = builder.Build();
            // Minimal API
            app.MapGet("/ping", () => "pong");
            app.MapGet("/minimal/test", () => new { message = "Minimal API" });
            // Controllers
            app.MapControllers();
            app.Run();
        }
    }
}
