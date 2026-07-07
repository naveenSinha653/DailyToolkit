using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DailyToolkit.Application.Interfaces.pdf
{
    public interface ICompressPdfService
    {
        Task<byte[]> CompressPdfAsync(IFormFile file, int quality);
    }
}
