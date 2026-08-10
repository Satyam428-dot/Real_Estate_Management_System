using Microsoft.EntityFrameworkCore;
using Inquiry_Management_DotNet.Data;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure CORS for React Frontend & Vercel
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure EF Core DbContext with official Oracle MySql.EntityFrameworkCore 10
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (!string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddDbContext<InquiryDbContext>(options =>
    {
        options.UseMySQL(connectionString);
    });
}
else
{
    builder.Services.AddDbContext<InquiryDbContext>(options =>
    {
        options.UseInMemoryDatabase("InquiryDb");
    });
}

var app = builder.Build();

// Ensure database table exists
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<InquiryDbContext>();
        db.Database.EnsureCreated();
        Console.WriteLine("[DotNet Backend] Connected to real_estate_management MySQL database!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DotNet Backend] Database notice: {ex.Message}");
    }
}

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();
