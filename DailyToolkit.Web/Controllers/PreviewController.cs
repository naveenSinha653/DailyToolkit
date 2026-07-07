using Microsoft.AspNetCore.Mvc;

namespace DailyToolkit.Web.Controllers
{
    public class PreviewController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
