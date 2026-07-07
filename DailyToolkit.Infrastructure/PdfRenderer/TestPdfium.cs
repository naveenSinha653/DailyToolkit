using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Patagames.Pdf;
using Patagames.Pdf.Net;

namespace DailyToolkit.Infrastructure.PdfRenderer
{
    public class TestPdfium
    {
        public void Test()
        {
            PdfCommon.Initialize();

            using var document = PdfDocument.Load("sample.pdf");

            int pages = document.Pages.Count;
        }
    }
}
