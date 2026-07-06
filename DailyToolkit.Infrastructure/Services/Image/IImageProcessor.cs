using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DailyToolkit.Infrastructure.Services.Image
{
    public interface IImageProcessor
    {
        Task<ImageValidationResult> ValidateAsync(List<IFormFile> files);

        Task<List<MemoryStream>> NormalizeAsync(List<IFormFile> files);
    }
}
