using DailyToolkit.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DailyToolkit.Application.Interfaces
{
    public interface IToolCategoryRepository
    {
        Task<List<ToolCategory>> GetAllAsync();
    }
}
