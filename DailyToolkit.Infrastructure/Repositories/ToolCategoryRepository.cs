using Dapper;
using DailyToolkit.Application.Interfaces;
using DailyToolkit.Domain.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DailyToolkit.Infrastructure.Repositories
{
    public class ToolCategoryRepository : IToolCategoryRepository
    {
        private readonly IConfiguration _configuration;

        public ToolCategoryRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<List<ToolCategory>> GetAllAsync()
        {
            using var connection = new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection"));

            string sql = @"
                SELECT *
                FROM ToolCategory
                WHERE IsActive = 1
                ORDER BY DisplayOrder";

            var result = await connection.QueryAsync<ToolCategory>(sql);

            return result.ToList();
        }
    }
}
