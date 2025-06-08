using DBHelper;
using Google.OrTools.ConstraintSolver;
using MachineSchedules.AntColony;
using MachineSchedules.Optimizer.MachineSchedules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules.Optimizer
{
    public class CPExecuter
    {
        public async Task Executer()
        {

           AzadContext dbContext = new AzadContext();

         
            DateTime startTime = DateTime.Now; // or set a specific time
            Console.WriteLine($"\nRun() Start Time:     {startTime}");
            var optimizer = new ConstrainProgramming(dbContext, startTime);
            await optimizer.SolveTasks();
            // Calculate makespan from database
            DateTime scheduleStart, scheduleEnd;
            decimal totalMakespan = 0m;

            var result = dbContext.Database.SqlQueryRaw<ScheduleRangeDto>(@$" SELECT MIN(StartDate) AS StartDate, MAX(EndDate) AS EndDate
            FROM [MachineSchedule] where [Algorithm]='CP' ").Single();

            scheduleStart = result.StartDate;
            scheduleEnd = result.EndDate;
            totalMakespan = (decimal)(scheduleEnd - scheduleStart).TotalMinutes;

            // Track execution end time
            var executionEndTime = DateTime.Now;
            var executionDuration = executionEndTime - startTime;

            // Output timing
            Console.WriteLine($"\nSchedule Start Time: {scheduleStart}");
            Console.WriteLine($"Schedule End Time:   {scheduleEnd}");
            Console.WriteLine($"Makespan Duration:   {totalMakespan} minutes");
           
            Console.WriteLine($"Run() End Time:       {executionEndTime}");
            Console.WriteLine($"Run() Duration:       {executionDuration.TotalSeconds:F2} seconds");
        }

}
}
