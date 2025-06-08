using Google.OrTools.Sat;
using MachineSchedules.DBRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MachineSchedules
{
    public class MachineScheduleOptimizer
    {
        public class OperationModel
        {
            public int OperationNumber { get; set; }
            public Dictionary<int, double> MachineDurations { get; set; } // Machine ID to Duration
        }

        public async Task SolveTasks()
        {
            // example job list
            List<JobModel> allJobs = await GetExampleJobs();

            if (allJobs == null || allJobs.Count == 0)
            {
                Console.WriteLine("No jobs to schedule.");
                return;
            }

            // planning horizon
            double horizon = allJobs.Sum(job => job.Operationlist.Sum(task => task.MachineDurations.Values.Max()));
            CpModel model = new CpModel();

            // Tüm görevler ve interval'lar için yapılandırmalar
            Dictionary<Tuple<int, int, int>, Tuple<IntVar, IntVar, IntervalVar, BoolVar>> allTasks = new Dictionary<Tuple<int, int, int>, Tuple<IntVar, IntVar, IntervalVar, BoolVar>>();
            Dictionary<int, List<IntervalVar>> machineToIntervals = GetMachinesToIntervals(allJobs, allTasks, horizon, model);

            // Çakışmama kısıtları
            foreach (var machine in machineToIntervals.Keys)
            {
                model.AddNoOverlap(machineToIntervals[machine]);
            }

            // Görev sırası kısıtları
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

            // Her görev için tek makine seçimi kısıtları
            foreach (var job in allJobs)
            {
                foreach (var task in job.Operationlist)
                {
                    List<BoolVar> machineSelectionVars = new List<BoolVar>();

                    foreach (var machine in task.MachineDurations.Keys)
                    {
                        var key = Tuple.Create(job.JobId, task.OperationNumber, machine);
                        machineSelectionVars.Add(allTasks[key].Item4); // BoolVar (Seçim değişkeni)
                    }

                    // Toplamda sadece bir makine seçilebilir
                    model.Add(LinearExpr.Sum(machineSelectionVars) == 1);
                }
            }

            // Makespan minimizasyonu
            IntVar makespan = model.NewIntVar(0, (long)horizon, "makespan");
            List<IntVar> taskEndTimes = new List<IntVar>();
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

            // Modeli çöz
            CpSolver solver = new CpSolver();
            CpSolverStatus status = solver.Solve(model);

            // Sonuçları yazdır
            if (status == CpSolverStatus.Optimal || status == CpSolverStatus.Feasible)
            {
                Console.WriteLine($"Optimal Makespan: {solver.ObjectiveValue}");
                foreach (var job in allJobs)
                {
                    foreach (var task in job.Operationlist)
                    {
                        foreach (var machine in task.MachineDurations.Keys)
                        {
                            var key = Tuple.Create(job.JobId, task.OperationNumber, machine);

                            if (allTasks.ContainsKey(key) && solver.BooleanValue(allTasks[key].Item4)) // Sadece seçilen makine
                            {
                                int start = (int)solver.Value(allTasks[key].Item1);
                                int duration = (int)task.MachineDurations[machine];
                                Console.WriteLine($"Job {job.JobId}, Task {task.OperationNumber} on Machine {machine} starts at {MinutesToTime(start)} and ends at {MinutesToTime(start + duration)}");
                            }
                        }
                    }
                }
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

        private Dictionary<int, List<IntervalVar>> GetMachinesToIntervals(List<JobModel> allJobs, Dictionary<Tuple<int, int, int>, Tuple<IntVar, IntVar, IntervalVar, BoolVar>> allTasks,
            double horizon, CpModel model)
        {
            Dictionary<int, List<IntervalVar>> machineToIntervals = new Dictionary<int, List<IntervalVar>>();

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
                            machineToIntervals.Add(machine, new List<IntervalVar>());
                        }
                        machineToIntervals[machine].Add(interval);
                    }
                }
            }

            return machineToIntervals;
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
