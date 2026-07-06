using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace DailyToolkit.Application.Interfaces
{
    public interface IPdfService
    {
        Task<byte[]> ConvertImagesAsync(
            List<IFormFile> images);
        Task<byte[]> MergePdfAsync(List<IFormFile> files);
        Task<byte[]> SplitPdfAsync( IFormFile file,string pageRange);
    }
}
