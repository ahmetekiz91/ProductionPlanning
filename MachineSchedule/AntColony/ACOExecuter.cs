using DBHelper;
using Google.Protobuf.WellKnownTypes;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules.AntColony
{
    public class ScheduleRangeDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
    public class ACOExecuter
    {
        public List<(int, List<int>)> jobs { get; set; }
        
        public List<(int, List<int>)> submachines { get; set; }//operation, submachines
        
        public List<(int, int, decimal)> operations { get; set; }
       
        public DateTime startDate { get; set; }
        
        public ACOExecuter(DateTime startDate)
        {
            this.startDate = startDate;
        }

        public async Task<List<(int, List<int>)>> getJobs()
        {
            List<(int, List<int>)> list = new List<(int, List<int>)>();

            using (var context = new AzadContext())
            {
                var productionorders = await context.ProductionOrders.Where(b => b.IsCompleted == 0).ToListAsync();

                for (var i = 0; i < productionorders.Count; i++)
                {
                    var obj = await context.Items.Where(v => v.ID == productionorders[i].ItemID).FirstAsync();

                    if (obj == null) break;

                    var operationlist = await context.Database.SqlQueryRaw<int>(@" SELECT QueueNumber FROM ItemProcesses where IGID in (" + (int)obj.IGID + @") group by QueueNumber").ToListAsync();

                    list.Add((productionorders[i].ID, operationlist));
                }
            }
            return list;
        }

        public async Task<List<(int, List<int>)>> getSubMachines(int malzgrupid)
        {
            List<(int, List<int>)> submachinelists = new List<(int, List<int>)>();

            using (var context = new AzadContext())
            {
                var operationlist = await context.Database.SqlQueryRaw<int>(@" SELECT QueueNumber FROM ItemProcesses where IGID in (" + malzgrupid + @")  group by QueueNumber").ToListAsync();

                for (var i = 0; i < operationlist.Count; i++)
                {
                    var filteredlist = await context.Database.SqlQueryRaw<int>(@" SELECT [ID] FROM [SubMachines] where QueueNumber = " + operationlist[i] + " and  [PoductionLineID] in (Select ID From ProductionLines where IGID in (" + malzgrupid + @")) ").ToListAsync();

                    submachinelists.Add((operationlist[i], filteredlist));
                }
            }
            return submachinelists;
        }

        public async Task<List<(int, int, decimal)>> getOperations(List<(int, List<int>)> jobs)
        {
            try
            {
                List<(int, int, decimal)> operations = new List<(int, int, decimal)>();

                using (var ctx = new AzadContext())
                {
                    foreach (var item in jobs)
                    {
                        //each production types includes 9 steps with respect to initial assumption. there for the upper bound is 9
                        for (int i = 0; i < 9; i++)
                        {
                            var submachinelist = await ctx.SubMachines.Where(v => v.QueueNumber == i + 1).ToListAsync();

                            var productionorder = await ctx.ProductionOrders.Where(x => x.ID == item.Item1).FirstAsync();
                            for (int k = 0; k < submachinelist.Count; k++)
                            {
                                decimal? processtime = await new Helper().calculateWaitingtime(ctx, i + 1, submachinelist[k], productionorder);
                                operations.Add((item.Item1, submachinelist[k].ID, (decimal)processtime));
                            }

                        }
                    }
                }
                return operations;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

            return null;
        }

        public async Task Run()
        {
            // Track execution start time
            var executionStartTime = DateTime.Now;

            // Example input data
            var jobs = getJobs().GetAwaiter().GetResult();
            var submachines = getSubMachines(1).GetAwaiter().GetResult();
            var operations = getOperations(jobs).GetAwaiter().GetResult();

            // Initialize pheromone matrix
            double[,] initialPheromones = new double[5, 9];

            // Initialize ACO
            ACOFJSP aco = new ACOFJSP(jobs, submachines, operations, initialPheromones, alpha: 1.5, beta: 3.5, evaporationRate: 0.25, Q: 100);

            // Run ACO algorithm
            var (bestSolution, bestMakespan) = aco.Run(iterations: 2000, numAnts: 20);
            // Output results
            Console.WriteLine("Best Solution:");
            foreach (var job in bestSolution)
            {
                SaveDB(job.Item1, job.Item2, operations).GetAwaiter().GetResult();
                Console.WriteLine($"Job {job.Item1}: Operations -> {string.Join(", ", job.Item2)}");
            }

            // Calculate makespan from database
            DateTime scheduleStart, scheduleEnd;
            decimal totalMakespan = 0m;

            var context = new AzadContext();
            var result = await context.Database.SqlQuery<ScheduleRangeDto>(@$"
SELECT MIN(StartDate) AS StartDate, MAX(EndDate) AS EndDate FROM [MachineSchedule] where [Algorithm]='ACO' ").SingleAsync();
            
            scheduleStart = result.StartDate;
            scheduleEnd = result.EndDate;
            totalMakespan = (decimal)(scheduleEnd - scheduleStart).TotalMinutes;

            // Track execution end time
            var executionEndTime = DateTime.Now;
            var executionDuration = executionEndTime - executionStartTime;

            // Output timing
            Console.WriteLine($"\nSchedule Start Time: {scheduleStart}");
            Console.WriteLine($"Schedule End Time:   {scheduleEnd}");
            Console.WriteLine($"Makespan Duration:   {totalMakespan} minutes");

            Console.WriteLine($"\nRun() Start Time:     {executionStartTime}");
            Console.WriteLine($"Run() End Time:       {executionEndTime}");
            Console.WriteLine($"Run() Duration:       {executionDuration.TotalSeconds:F2} seconds");

            ScheduleInfo scheduleInfos = new ScheduleInfo
            {
                CDate = DateTime.Now,
                TotalMakespan = totalMakespan,
                ScheduleStart = scheduleStart,
                ScheduleEnd = scheduleEnd,
                ExecutionDuration = (decimal)(DateTime.Now - executionStartTime).TotalSeconds,
                Iterations = 2000,
                Runtimes = (decimal)(DateTime.Now - executionStartTime).TotalMinutes,
                ExecutionStartTime = executionStartTime,
                ExecutionEndTime = executionEndTime,
                Algorithm = "ACO"
            };
            context.Database.ExecuteSqlRaw("truncate table MachineSchedule;");
            context.ScheduleInfos.Add(scheduleInfos);
            await context.SaveChangesAsync();
        }


        public async Task<bool> SaveDB(int Jobid, List<int> submachines, List<(int, int, decimal)> operations)
        {
            using (var context = new AzadContext())
            {
                try
                {
                    var productionorder = await context.ProductionOrders.FirstOrDefaultAsync(v => v.ID == Jobid);
                    if (productionorder == null)
                    {
                        throw new InvalidOperationException($"No ProductionOrder found for JobId {Jobid}.");
                    }

                    // order the submachines by their queue number
                    var submachineInfos = await context.SubMachines.Where(s => submachines.Contains(s.ID)).Select(s => new { s.ID, s.QueueNumber })
                        .ToListAsync();

                    var orderedSubmachines = submachineInfos
                        .OrderBy(s => s.QueueNumber)
                        .ToList();

                    DateTime? previousEndDate = this.startDate;

                    foreach (var item in orderedSubmachines)
                    {
                        int machineId = item.ID;
                        int? queueNumber = item.QueueNumber;

                        var latestSchedule = await context.MachineSchedules.Where(v=>v.Algorithm=="ACO")
                            .Where(v => v.MachineId == machineId)
                            .OrderByDescending(v => v.EndDate)
                            .FirstOrDefaultAsync();

                        var startDate = previousEndDate ?? this.startDate;
                        if (latestSchedule != null && latestSchedule.EndDate > startDate)
                        {
                            startDate = latestSchedule.EndDate.Value;
                        }

                        var obj = operations.FirstOrDefault(v => v.Item1 == Jobid && v.Item2 == machineId);
                        if (obj.Equals(default(ValueTuple<int, int, decimal>)))
                        {
                            throw new InvalidOperationException($"No operation found for JobId {Jobid} and MachineId {machineId}.");
                        }

                        var duration = (double)obj.Item3 / 60;
                        var endDate = startDate.AddMinutes(duration);

                        MachineSchedulerunninginfos machineSchedule = new MachineSchedulerunninginfos
                        {
                            StartDate = startDate,
                            EndDate = endDate,
                            POID = Jobid,
                            MachineId = machineId,
                            Amount = productionorder.Amount,
                            WaitingTime = obj.Item3 / 60,
                            ItemID = productionorder.ItemID,
                            UnitID = productionorder.UnitID,
                            QueueNumber = queueNumber,
                            Algorithm = "ACO",
                        };

                        context.MachineSchedulerunninginfos.Add(machineSchedule);
                        await context.SaveChangesAsync();

                        MachineSchedule ms = new MachineSchedule
                        {
                            StartDate = startDate,
                            EndDate = endDate,
                            POID = Jobid,
                            MachineId = machineId,
                            Amount = productionorder.Amount,
                            WaitingTime = obj.Item3 / 60,
                            ItemID = productionorder.ItemID,
                            UnitID = productionorder.UnitID,
                            QueueNumber = queueNumber,
                            Algorithm = "ACO",
                        };

                        context.MachineSchedules.Add(ms);
                        await context.SaveChangesAsync();

                        //the next start date is the end date of the previous operation
                        previousEndDate = endDate;
                    }

                    return true;
                }
                catch (Exception ex)
                {
                    throw new Exception($"Error in SaveDB: {ex.Message}", ex);
                }
            }
        }

    }
}
