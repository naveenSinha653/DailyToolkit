using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DailyToolkit.Infrastructure.Services.Image
{
    public class ImageValidationResult
    {
        public bool IsValid { get; set; }

        public List<string> Errors { get; set; } = new();

        public List<string> Warnings { get; set; } = new();
    }
}
