using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DailyToolkit.Infrastructure.Services.Image
{
    public class ImageProcessor : IImageProcessor
    {
        private readonly ImageSettings _settings;

        public ImageProcessor(IOptions<ImageSettings> options)
        {
            _settings = options.Value;
        }
       

        

        

        public async Task<ImageValidationResult> ValidateAsync(List<IFormFile> files)
        {
            var result = new ImageValidationResult
            {
                IsValid = true
            };

            if (files == null || files.Count == 0)
            {
                result.IsValid = false;
                result.Errors.Add("Please select at least one image.");
                return result;
            }

            if (files.Count > _settings.MaxImages)
            {
                result.IsValid = false;
                result.Errors.Add($"Maximum {_settings.MaxImages} images allowed.");
            }

            foreach (var file in files)
            {
                var extension = Path.GetExtension(file.FileName).ToLower();

                if (!_settings.AllowedExtensions.Contains(extension))
                {
                    result.IsValid = false;
                    result.Errors.Add($"{file.FileName} is not supported.");
                    continue;
                }

                if (file.Length > _settings.MaxFileSize)
                {
                    result.IsValid = false;
                    result.Errors.Add($"{file.FileName} exceeds 20 MB.");
                    continue;
                }

                try
                {
                    using var stream = file.OpenReadStream();

                    using var image = await SixLabors.ImageSharp.Image.LoadAsync(stream);
                }
                catch
                {
                    result.IsValid = false;
                    result.Errors.Add($"{file.FileName} is corrupted.");
                }
            }

            return result;
        }

        public async Task<List<MemoryStream>> NormalizeAsync(List<IFormFile> files)
        {
            var output = new List<MemoryStream>();

            foreach (var file in files)
            {
                using var input = file.OpenReadStream();

                using var image = await SixLabors.ImageSharp.Image.LoadAsync(input);

                image.Mutate(x =>
                {
                    x.AutoOrient();
                });

                var ms = new MemoryStream();

                await image.SaveAsync(ms, new PngEncoder());

                ms.Position = 0;

                output.Add(ms);
            }

            return output;
        }
    }
}
