using DailyToolkit.Application.Interfaces.pdf;
using Microsoft.AspNetCore.Http;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DailyToolkit.Infrastructure.Services
{
    public class DeletePagePdfService : IDeletePagePdfService
    {
        public async Task<byte[]> DeletePagesAsync(
            IFormFile file,
            string pages)
        {
            using var input = new MemoryStream();

            await file.CopyToAsync(input);

            input.Position = 0;

            using var document =
                PdfReader.Open(input, PdfDocumentOpenMode.Import);

            using var output =
                new PdfDocument();

            List<int> deletePages = ParsePages(
                pages,
                document.PageCount);

            for (int i = 1; i <= document.PageCount; i++)
            {
                if (!deletePages.Contains(i))
                {
                    output.AddPage(document.Pages[i - 1]);
                }
            }

            using var stream =
                new MemoryStream();

            output.Save(stream, false);

            return stream.ToArray();
        }

        private List<int> ParsePages(
            string pageText,
            int totalPages)
        {
            var result = new List<int>();

            foreach (var part in pageText.Split(','))
            {
                if (part.Contains('-'))
                {
                    var range = part.Split('-');

                    int start = int.Parse(range[0]);

                    int end = int.Parse(range[1]);

                    for (int i = start; i <= end; i++)
                    {
                        if (i >= 1 &&
                            i <= totalPages)
                        {
                            result.Add(i);
                        }
                    }
                }
                else
                {
                    int page = int.Parse(part);

                    if (page >= 1 &&
                        page <= totalPages)
                    {
                        result.Add(page);
                    }
                }
            }

            return result.Distinct().ToList();
        }
    }
}
