
using DBHelper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules.GA
{
    public class DBOps
    {
        private readonly AzadContext context;

        public DBOps(AzadContext context)
        {
            this.context = context;
        }

        public async Task<List<ItemProcesses>> GetItemProcessesAsync(string query)
        {
            List<ItemProcesses> list = new List<ItemProcesses>();
            try
            {
                list = await this.context.Database.SqlQueryRaw<ItemProcesses>(query).ToListAsync();
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<ProductionOrder>> getTasks(string query)
        {
            List<ProductionOrder> list = new List<ProductionOrder>();
            {
                try
                {
                    list = await context.Database.SqlQueryRaw<ProductionOrder>(query).ToListAsync();
                    return list;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        public async Task<List<int>> getQueueNumbers(string query)
        {
            try
            {
                var result = await context.Database.SqlQueryRaw<int>(query).ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error executing query: {query}. Details: {ex.Message}", ex);
            }
        }

    }
}
