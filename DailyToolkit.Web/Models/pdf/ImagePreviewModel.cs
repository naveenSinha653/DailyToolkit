namespace DailyToolkit.Web.Models.pdf
{
    public class ImagePreviewModel
    {
        public string FileName { get; set; } = string.Empty;

        public string Base64 { get; set; } = string.Empty;

        public int Width { get; set; }

        public int Height { get; set; }
    }
}
