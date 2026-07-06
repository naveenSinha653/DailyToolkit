using DailyToolkit.Application.Interfaces;
using DailyToolkit.Infrastructure.Services.Image;
using Microsoft.AspNetCore.Http;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace DailyToolkit.Infrastructure.Services
{
    public class PdfService : IPdfService
    {
        private readonly IImageProcessor _imageProcessor;

        public PdfService(IImageProcessor imageProcessor)
        {
            _imageProcessor = imageProcessor;
        }

        public async Task<byte[]> ConvertImagesAsync(List<IFormFile> images)
        {
            var validation = await _imageProcessor.ValidateAsync(images);

            if (!validation.IsValid)
            {
                throw new Exception(string.Join(Environment.NewLine, validation.Errors));
            }

            var normalizedImages = await _imageProcessor.NormalizeAsync(images);

            var document = new PdfDocument();

            foreach (var stream in normalizedImages)
            {
                stream.Position = 0;

                using var image = XImage.FromStream(stream);

                var page = document.AddPage();

                page.Width = image.PointWidth;
                page.Height = image.PointHeight;

                using var gfx = XGraphics.FromPdfPage(page);

                gfx.DrawImage(
                    image,
                    0,
                    0,
                    page.Width.Point,
                    page.Height.Point);

                stream.Dispose();
            }

            using var output = new MemoryStream();

            document.Save(output, false);

            return output.ToArray();
        }

        public async Task<byte[]> MergePdfAsync(List<IFormFile> files)
        {
            if (files == null || files.Count < 2)
                throw new Exception("Please select at least two PDF files.");

            var outputDocument = new PdfDocument();

            foreach (var file in files)
            {
                if (file.Length == 0)
                    continue;

                if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
                    throw new Exception($"{file.FileName} is not a PDF file.");

                using var stream = new MemoryStream();

                await file.CopyToAsync(stream);

                stream.Position = 0;

                var inputDocument = PdfReader.Open(stream, PdfDocumentOpenMode.Import);

                for (int i = 0; i < inputDocument.PageCount; i++)
                {
                    outputDocument.AddPage(inputDocument.Pages[i]);
                }
            }

            using var outputStream = new MemoryStream();

            outputDocument.Save(outputStream, false);

            return outputStream.ToArray();
        }

        public async Task<byte[]> SplitPdfAsync(IFormFile file, string pageRange)
        {
            using var inputStream = new MemoryStream();

            await file.CopyToAsync(inputStream);

            inputStream.Position = 0;

            using var inputDocument = PdfReader.Open(inputStream, PdfDocumentOpenMode.Import);

            using var outputDocument = new PdfDocument();

            var pages = ParsePageRanges(pageRange, inputDocument.PageCount);

            foreach (var pageNumber in pages)
            {
                outputDocument.AddPage(inputDocument.Pages[pageNumber - 1]);
            }

            using var outputStream = new MemoryStream();

            outputDocument.Save(outputStream, false);

            return outputStream.ToArray();
        }
        private List<int> ParsePageRanges(string pageRange, int totalPages)
        {
            var pages = new List<int>();

            var parts = pageRange.Split(',', StringSplitOptions.RemoveEmptyEntries);

            foreach (var part in parts)
            {
                if (part.Contains('-'))
                {
                    var range = part.Split('-');

                    if (range.Length != 2)
                        throw new Exception("Invalid page range.");

                    int start = int.Parse(range[0].Trim());
                    int end = int.Parse(range[1].Trim());

                    if (start < 1 || end > totalPages || start > end)
                        throw new Exception($"Invalid page range: {part}");

                    for (int i = start; i <= end; i++)
                    {
                        if (!pages.Contains(i))
                            pages.Add(i);
                    }
                }
                else
                {
                    int page = int.Parse(part.Trim());

                    if (page < 1 || page > totalPages)
                        throw new Exception($"Page {page} does not exist.");

                    if (!pages.Contains(page))
                        pages.Add(page);
                }
            }

            pages.Sort();

            return pages;
        }
    }
}
