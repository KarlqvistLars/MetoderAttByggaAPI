
using SignalRApi.Hubs;

namespace SignalRApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options => {
                options.AddPolicy("AngularClient", policy => {
                    policy
                        .WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            builder.Services.AddSignalR();

            var app = builder.Build();

            app.UseCors("AngularClient");


            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.MapHub<ChatHub>("/hubs/chat");

            app.Run();
        }
    }
}
