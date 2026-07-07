using DailyToolkit.Application.Interfaces;
using DailyToolkit.Application.Interfaces.pdf;
using DailyToolkit.Infrastructure.Repositories;
using DailyToolkit.Infrastructure.Services;
using DailyToolkit.Infrastructure.Services.Image;
using DailyToolkit.Infrastructure.Services.Pdf;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<IToolCategoryRepository, ToolCategoryRepository>();
builder.Services.AddScoped<IPdfService, PdfService>();
builder.Services.AddScoped<IImageProcessor, ImageProcessor>();
builder.Services.Configure<ImageSettings>(builder.Configuration.GetSection("ImageSettings"));

builder.Services.AddScoped<IMergePdfService, MergePdfService>();
builder.Services.AddScoped<IDeletePagePdfService, DeletePagePdfService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (!app.Environment.IsDevelopment())
//{
//    app.UseExceptionHandler("/Home/Error");
//    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
//    app.UseHsts();
//}
app.UseDeveloperExceptionPage();

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
