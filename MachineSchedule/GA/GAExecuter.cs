using DBHelper;
using MachineSchedules.AntColony;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules.GA
{
    public class GAExecuter
    {
        public GAExecuter() { }

        public void ExecuteGA()
        {
            DateTime startTime = DateTime.Now;
            Console.WriteLine($"Starting Time: {startTime:yyyy-MM-dd HH:mm:ss}");
            AzadContext context = new AzadContext();
            // Initialize the GA solver
            var solver = new GASolver<GAModel>(context, startTime)
            {
                numberOfMachines = 10,     // Set the number of machines
                numberofpopulation = 2000, // Set the population size
            };

            // Run the Genetic Algorithm
            solver.RunGA(10,1500).GetAwaiter().GetResult();


            // Calculate makespan from database
            DateTime scheduleStart, scheduleEnd;
            decimal totalMakespan = 0m;

            var result =  context.Database.SqlQueryRaw<ScheduleRangeDto>(@$" SELECT MIN(StartDate) AS StartDate, MAX(EndDate) AS EndDate
            FROM [MachineSchedule] where [Algorithm]='GA' ").Single();

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
            Console.WriteLine($"\nRun() Start Time:     {startTime}");
            Console.WriteLine($"Run() End Time:       {executionEndTime}");
            Console.WriteLine($"Run() Duration:       {executionDuration.TotalSeconds:F2} seconds");

            ScheduleInfo scheduleInfos = new ScheduleInfo
            {
                CDate = DateTime.Now,
                TotalMakespan = totalMakespan,
                ScheduleStart = scheduleStart,
                ScheduleEnd = scheduleEnd,
                ExecutionDuration = (decimal)(DateTime.Now - startTime).TotalSeconds,
                Iterations = 2000,
                Runtimes = (decimal)(DateTime.Now - startTime).TotalMinutes,
                ExecutionStartTime = startTime,
                ExecutionEndTime = executionEndTime,
                Algorithm = "GA"
            };
            context.Database.ExecuteSqlRaw("truncate table MachineSchedule;");
            context.ScheduleInfos.Add(scheduleInfos);
            context.SaveChangesAsync();
        
    }

    }
}
