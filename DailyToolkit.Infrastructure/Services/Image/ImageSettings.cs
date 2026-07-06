using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DailyToolkit.Infrastructure.Services.Image
{
    public class ImageSettings
    {

        public int MaxImages { get; set; } = 100;

        public long MaxFileSize { get; set; } = 20 * 1024 * 1024;

        public List<string> AllowedExtensions { get; set; } = new()
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".bmp",
        ".gif",
        ".tif",
        ".tiff",
        ".webp",
        ".ico"
    };
    }
}
