using DailyToolkit.Domain.Entities;

namespace DailyToolkit.Web.ViewModels
{
    public class HomeViewModel
    {
        public List<ToolCategory> Categories { get; set; } = new();
    }
}
