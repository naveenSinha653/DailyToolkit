using DailyToolkit.Application.Interfaces.pdf;
using Microsoft.AspNetCore.Http;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;

namespace DailyToolkit.Infrastructure.Services.Pdf
{
    public class MergePdfService : IMergePdfService
    {
        public async Task<byte[]> MergePdfAsync(List<IFormFile> files)
        {
            if (files == null || files.Count < 2)
                throw new Exception("Please select at least two PDF files.");

            using var outputDocument = new PdfDocument();

            foreach (var file in files)
            {
                if (file.Length == 0)
                    continue;

                if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
                    throw new Exception($"{file.FileName} is not a PDF file.");

                using var stream = new MemoryStream();

                await file.CopyToAsync(stream);

                stream.Position = 0;

                using var inputDocument =
                    PdfReader.Open(stream, PdfDocumentOpenMode.Import);

                for (int i = 0; i < inputDocument.PageCount; i++)
                {
                    outputDocument.AddPage(inputDocument.Pages[i]);
                }
            }

            using var outputStream = new MemoryStream();

            outputDocument.Save(outputStream, false);

            return outputStream.ToArray();
        }
    }
}