using DailyToolkit.Application.Interfaces;
using DailyToolkit.Application.Interfaces.pdf;
using DailyToolkit.Web.Models.pdf;
using Microsoft.AspNetCore.Mvc;


namespace DailyToolkit.Web.Controllers
{
    public class PdfController : Controller
    {
        private readonly IPdfService _pdfService;
        private readonly IDeletePagePdfService _deletePagePdfService;


        public PdfController(
    IPdfService pdfService, IDeletePagePdfService deletePagePdfService)
        {
            _pdfService = pdfService;
            _deletePagePdfService = deletePagePdfService;
        }

        public IActionResult ImageToPdf()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Convert(ImageToPdfRequest request)
        {
            try
            {
                var pdf = await _pdfService.ConvertImagesAsync(request.Images);

                return File(
                    pdf,
                    "application/pdf",
                    "DailyToolkit.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public IActionResult MergePdf()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> MergePdf(List<IFormFile> files)
        {
            try
            {
                if (files == null || files.Count < 2)
                {
                    return BadRequest("Please select at least two PDF files.");
                }

                var pdfBytes = await _pdfService.MergePdfAsync(files);

                return File(pdfBytes, "application/pdf", "Merged.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public IActionResult SplitPdf()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> SplitPdf(IFormFile file, string pageRange)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("Please select a PDF file.");

                if (string.IsNullOrWhiteSpace(pageRange))
                    return BadRequest("Please enter page range.");

                var pdf = await _pdfService.SplitPdfAsync(file, pageRange);

                return File(pdf, "application/pdf", "Split.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public IActionResult CompressPdf()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CompressPdf(
            IFormFile file,
            int quality)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("Please select a PDF.");

                var pdf = await _pdfService.CompressPdfAsync(file, quality);

                return File(
                    pdf,
                    "application/pdf",
                    "Compressed.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public IActionResult RotatePdf()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> RotatePdf(IFormFile file, int rotation)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("Please select a PDF.");

                var pdf = await _pdfService.RotatePdfAsync(file, rotation);

                return File(
                    pdf,
                    "application/pdf",
                    "Rotated.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
       
        public IActionResult ProtectPdf()
        {
            return View();
        }
       
        public IActionResult WatermarkPdf()
        {
            return View();
        }
        public IActionResult DeletePages()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> DeletePages(
    IFormFile file,
    string pages)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("Please select a PDF.");

                if (string.IsNullOrWhiteSpace(pages))
                    return BadRequest("Please enter page numbers.");

                var pdf = await _deletePagePdfService.DeletePagesAsync(
                    file,
                    pages);

                return File(
                    pdf,
                    "application/pdf",
                    "DeletedPages.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
