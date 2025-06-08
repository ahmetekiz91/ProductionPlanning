using DBHelper;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

using System.Globalization;
namespace WEBAPI;


    public class Program
{
    public static IHostBuilder CreateHostBuilder(string[] args) =>
Host.CreateDefaultBuilder(args)
  .ConfigureWebHostDefaults(webBuilder =>
  {
      webBuilder.ConfigureServices((hostContext, services) =>
      {
          services.AddAutoMapper(typeof(Program));
          // Configure DbContext options
          services.AddDbContext<AzadContext>(options =>
          {
              // Define your DbContext configuration options here
              options.UseSqlServer(hostContext.Configuration.GetConnectionString("DefaultConnection"));
          });

          services.AddAuthorization();
        
          services.AddMvc().AddJsonOptions(opt => opt.JsonSerializerOptions.PropertyNamingPolicy = null);
          services.AddCors(options =>
          {
              options.AddPolicy("AllowAnyCorsPolicy", policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
          });
          //services.AddControllers()
          //          .AddJsonOptions(options =>
          //          {
          //              // Add a custom converter for decimals
          //              options.JsonSerializerOptions.Converters.Add(new JsonDecimalConverter());
          //              options.JsonSerializerOptions.PropertyNamingPolicy = null; // Optional: to prevent camel casing
          //          });
          // Register other services as needed
          services.AddScoped<DbContextFactory>();


         

          services.AddSwaggerGen(c =>
          {
              c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });
          });
           }).Configure(app =>
          {
          // Configure middleware and routing
          var env = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();

          // Configure middleware and routing
          if (env.IsDevelopment())
          {
              app.UseSwagger();
              app.UseSwaggerUI();
          }
          CultureInfo culture = new CultureInfo("tr-TR");
          var dateformat = new DateTimeFormatInfo
          {
              ShortDatePattern = "dd.MM.yyyy",
              LongDatePattern = "dd.MM.yyyy hh:MM:ss"
          };
          culture.DateTimeFormat = dateformat;
          var supportedCultures = new[]
          {
              culture
          };
          app.UseRequestLocalization(new RequestLocalizationOptions
          {
              DefaultRequestCulture = new RequestCulture(culture),
              SupportedCultures = supportedCultures,
              SupportedUICultures = supportedCultures
          });
          app.UseHttpsRedirection();
          app.UseAuthorization();
          app.UseCors("AllowAnyCorsPolicy");
          app.UseRouting();
          app.UseEndpoints(endpoints =>
          {
              endpoints.MapControllers();
          });
      });
  });
    
    public static void Main(string[] args)
    {
        try
        {
            var host = CreateHostBuilder(args).Build();

            Console.WriteLine("Application starting...");
            Console.WriteLine("Listening on the following URLs:");
            foreach (var address in host.Services.GetRequiredService<Microsoft.AspNetCore.Hosting.Server.IServer>().Features.Get<Microsoft.AspNetCore.Hosting.Server.Features.IServerAddressesFeature>().Addresses)
            {
                Console.WriteLine(address);
            }

            // Configure camel case problem handling
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                },
                Formatting = Formatting.Indented,
                FloatFormatHandling = FloatFormatHandling.String,
                FloatParseHandling = FloatParseHandling.Decimal,
                
            }; 

            host.Run();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            throw;
        }
    }
}