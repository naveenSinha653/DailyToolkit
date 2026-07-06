namespace DailyToolkit.Web.Models.pdf
{
    public class MergePdfRequest
    {
        public List<IFormFile> Files { get; set; } = new();
    }
}
