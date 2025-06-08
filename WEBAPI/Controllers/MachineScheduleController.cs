using DBHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MachineScheduleController : ControllerBase
    {
        private readonly AzadContext _context;

        public MachineScheduleController(AzadContext context)
        {
            _context = context;
        }

        // GET: api/MachineSchedule/gantt-data
        [HttpGet("gantt-data")]
        public async Task<IActionResult> GetGanttData()
        {
            try
            {
                var list = new List<MachineSchedule>();
                var rlist = await _context.MachineSchedules.ToListAsync();
                for (int i = 0; i < rlist.Count; i++)
                {
                    var obj = new MachineSchedule()
                    {
                        ID = rlist[i].ID,
                        Duration = ((DateTime)rlist[i].EndDate - (DateTime)rlist[i].StartDate).Minutes,
                        StartDate = rlist[i].StartDate,
                        EndDate = rlist[i].EndDate,
                        POID = rlist[i].POID,
                        MachineId = rlist[i].MachineId,
                        ItemID = rlist[i].ItemID,
                        UnitID = rlist[i].UnitID,
                        WaitingTime = rlist[i].WaitingTime,
                    };
                    list.Add(obj);
                }

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
     



    }
}
