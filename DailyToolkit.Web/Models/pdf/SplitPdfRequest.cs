namespace DailyToolkit.Web.Models.pdf
{
    public class SplitPdfRequest
    {
        public IFormFile? File { get; set; }

        public string PageRange { get; set; } = "";
    }
}
