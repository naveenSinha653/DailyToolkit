namespace DailyToolkit.Web.Models.pdf
{
    public class ImageToPdfRequest
    {
        public List<IFormFile> Images { get; set; } = new();

        public string PageSize { get; set; } = "A4";

        public string Orientation { get; set; } = "Portrait";

        public string Margin { get; set; } = "None";
    }
}
