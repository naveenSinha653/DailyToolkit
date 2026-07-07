using DailyToolkit.Application.Interfaces.pdf;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DailyToolkit.Infrastructure.Services
{
    public class WatermarkPdfService : IWatermarkPdfService
    {
        //public async Task<byte[]> WatermarkPdfAsync(
        //    IFormFile file,
        //    string watermarkText,
        //    int fontSize,
        //    int rotation,
        //    int opacity)
        //{
        //    using var input = new MemoryStream();

        //    await file.CopyToAsync(input);

        //    input.Position = 0;

        //    using PdfLoadedDocument document = new PdfLoadedDocument(input);

        //    // We'll add the watermark implementation here.

        //    using var output = new MemoryStream();

        //    document.Save(output);

        //    return output.ToArray();
        //}
    }
}
