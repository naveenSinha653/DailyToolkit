using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DailyToolkit.Application.Interfaces.pdf
{
    public interface ISplitPdfService
    {
        Task<byte[]> SplitPdfAsync(IFormFile file, string pageRange);
    }
}
