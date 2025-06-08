using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules.Optimizer
{
    using Google.OrTools.Sat;

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using DBHelper;
    using global::MachineSchedules.DBRepositories;

    namespace MachineSchedules
    {
        public class OperationModel
        {
            public int OperationNumber { get; set; }
            public Dictionary<int, double> MachineDurations { get; set; } // Machine ID to Duration in minutes
        }
        public class ConstrainProgramming
        {
          

            private readonly AzadContext context;
            private readonly DateTime startTime;

            public ConstrainProgramming(AzadContext dbContext, DateTime scheduleStartTime)
            {
                context = dbContext;
                startTime = scheduleStartTime;
            }

            public async Task SolveTasks()
            {
                List<JobModel> allJobs = await GetExampleJobs();

                if (allJobs == null || allJobs.Count == 0)
                {
                    Console.WriteLine("No jobs to schedule.");
                    return;
                }

                double horizon = allJobs.Sum(job => job.Operationlist.Sum(task => task.MachineDurations.Values.Max()));
                CpModel model = new CpModel();

                Dictionary<Tuple<int, int, int>, Tuple<IntVar, IntVar, IntervalVar, BoolVar>> allTasks = new();
                Dictionary<int, List<IntervalVar>> machineToIntervals = GetMachinesToIntervals(allJobs, allTasks, horizon, model);

                foreach (var machine in machineToIntervals.Keys)
                {
                    model.AddNoOverlap(machineToIntervals[machine]);
                }

                foreach (var job in allJobs)
                {
                    for (int i = 0; i < job.Operationlist.Count - 1; i++)
                    {
                        foreach (var machine1 in job.Operationlist[i].MachineDurations.Keys)
                        {
                            foreach (var machine2 in job.Operationlist[i + 1].MachineDurations.Keys)
                            {
                                var keyCurrent = Tuple.Create(job.JobId, job.Operationlist[i].OperationNumber, machine1);
                                var keyNext = Tuple.Create(job.JobId, job.Operationlist[i + 1].OperationNumber, machine2);

                                if (allTasks.ContainsKey(keyCurrent) && allTasks.ContainsKey(keyNext))
                                {
                                    model.Add(allTasks[keyNext].Item1 >= allTasks[keyCurrent].Item2);
                                }
                            }
                        }
                    }
                }

                foreach (var job in allJobs)
                {
                    foreach (var task in job.Operationlist)
                    {
                        List<BoolVar> machineSelectionVars = new();
                        foreach (var machine in task.MachineDurations.Keys)
                        {
                            var key = Tuple.Create(job.JobId, task.OperationNumber, machine);
                            machineSelectionVars.Add(allTasks[key].Item4);
                        }
                        model.Add(LinearExpr.Sum(machineSelectionVars) == 1);
                    }
                }

                IntVar makespan = model.NewIntVar(0, (long)horizon, "makespan");
                List<IntVar> taskEndTimes = new();
                foreach (var job in allJobs)
                {
                    foreach (var machine in job.Operationlist.Last().MachineDurations.Keys)
                    {
                        var key = Tuple.Create(job.JobId, job.Operationlist.Last().OperationNumber, machine);
                        if (allTasks.ContainsKey(key))
                        {
                            taskEndTimes.Add(allTasks[key].Item2);
                        }
                    }
                }
                model.AddMaxEquality(makespan, taskEndTimes);
                model.Minimize(makespan);

                CpSolver solver = new CpSolver();
                CpSolverStatus status = solver.Solve(model);

                if (status == CpSolverStatus.Optimal || status == CpSolverStatus.Feasible)
                {
                    Console.WriteLine($"Optimal Makespan: {solver.ObjectiveValue}");
                    await SaveCPScheduleToDB(allJobs, allTasks, solver);
                }
                else
                {
                    Console.WriteLine("No feasible solution found.");
                }

                Console.WriteLine("Statistics");
                Console.WriteLine($"  Conflicts: {solver.NumConflicts()}");
                Console.WriteLine($"  Branches : {solver.NumBranches()}");
                Console.WriteLine($"  Wall Time: {solver.WallTime()}s");
            }

            private Dictionary<int, List<IntervalVar>> GetMachinesToIntervals(
                List<JobModel> allJobs,
                Dictionary<Tuple<int, int, int>, Tuple<IntVar, IntVar, IntervalVar, BoolVar>> allTasks,
                double horizon,
                CpModel model)
            {
                Dictionary<int, List<IntervalVar>> machineToIntervals = new();

                foreach (var job in allJobs)
                {
                    foreach (var task in job.Operationlist)
                    {
                        foreach (var machine in task.MachineDurations.Keys)
                        {
                            string suffix = $"_{job.JobId}_{task.OperationNumber}_machine_{machine}";
                            IntVar start = model.NewIntVar(0, (long)horizon, "start" + suffix);
                            IntVar end = model.NewIntVar(0, (long)horizon, "end" + suffix);
                            BoolVar isMachineSelected = model.NewBoolVar($"selected_machine_{machine}_for_task_{task.OperationNumber}");
                            double duration = task.MachineDurations[machine];
                            IntervalVar interval = model.NewOptionalIntervalVar(start, (int)duration, end, isMachineSelected, "interval" + suffix);

                            var key = Tuple.Create(job.JobId, task.OperationNumber, machine);
                            allTasks[key] = Tuple.Create(start, end, interval, isMachineSelected);

                            if (!machineToIntervals.ContainsKey(machine))
                            {
                                machineToIntervals[machine] = new List<IntervalVar>();
                            }
                            machineToIntervals[machine].Add(interval);
                        }
                    }
                }

                return machineToIntervals;
            }

            private async Task SaveCPScheduleToDB(
                List<JobModel> allJobs,
                Dictionary<Tuple<int, int, int>, Tuple<IntVar, IntVar, IntervalVar, BoolVar>> allTasks,
                CpSolver solver)
            {
                try
                {
                    var productionOrders = await context.ProductionOrders.ToDictionaryAsync(p => p.ID);
                    var subMachines = await context.SubMachines.ToDictionaryAsync(m => m.ID);

                    List<MachineSchedule> schedules = new();
                    DateTime? firstStart = null;
                    DateTime? lastEnd = null;

                    foreach (var job in allJobs)
                    {
                        foreach (var task in job.Operationlist)
                        {
                            foreach (var machine in task.MachineDurations.Keys)
                            {
                                var key = Tuple.Create(job.JobId, task.OperationNumber, machine);
                                var taskData = allTasks[key];

                                if (solver.BooleanValue(taskData.Item4))
                                {
                                    int start = (int)solver.Value(taskData.Item1);
                                    int duration = (int)task.MachineDurations[machine];
                                    DateTime startTime = this.startTime.AddMinutes(start);
                                    DateTime endTime = startTime.AddMinutes(duration);
                                    decimal durationInHours = (decimal)duration / 60;

                                    if (!productionOrders.TryGetValue(job.JobId, out var productionOrder) ||
                                        !subMachines.TryGetValue(machine, out var subMachine))
                                        continue;

                                    schedules.Add(new MachineSchedule
                                    {
                                        POID = productionOrder.ID,
                                        MachineId = machine,
                                        ItemID = productionOrder.ItemID,
                                        UnitID = productionOrder.UnitID,
                                        Amount = productionOrder.Amount,
                                        WaitingTime = durationInHours,
                                        StartDate = startTime,
                                        EndDate = endTime,
                                        QueueNumber = subMachine.QueueNumber,
                                        Algorithm = "CP"
                                    });

                                    if (firstStart == null || startTime < firstStart) firstStart = startTime;
                                    if (lastEnd == null || endTime > lastEnd) lastEnd = endTime;
                                }
                            }
                        }
                    }

                    context.MachineSchedules.AddRange(schedules);
                    await context.SaveChangesAsync();

                    if (firstStart != null && lastEnd != null)
                    {
                        Console.WriteLine($"Schedule makespan: {(lastEnd - firstStart)?.TotalHours:F2} hours");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error saving CP schedule: " + ex.Message);
                }
            }

            private async Task<List<JobModel>> GetExampleJobs()
            {
                return await new DBOps().getAllProductionOrder();
            }

            static string MinutesToTime(int minutes)
            {
                int hours = minutes / 60;
                int mins = minutes % 60;
                return $"{hours:D2}:{mins:D2}";
            }
        }
    }

}
