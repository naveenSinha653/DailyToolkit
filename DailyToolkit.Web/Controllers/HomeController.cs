
using DailyToolkit.Application.Interfaces;
using DailyToolkit.Web.Models;
using DailyToolkit.Web.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace DailyToolkit.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly IToolCategoryRepository _repository;

        public HomeController(IToolCategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<IActionResult> Index()
        {
            HomeViewModel model = new();

            model.Categories = await _repository.GetAllAsync();

            return View(model);
        }
    }
}
