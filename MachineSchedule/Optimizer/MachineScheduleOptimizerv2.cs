using Google.OrTools.Sat;
using MachineSchedules.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MachineSchedules
{
    public class MachineScheduleOptimizerv2
    {
        private class OperationModel
        {
            public int OperationNumber { get; set; }
            public List<int> MachineOptions { get; set; } // List of machine IDs
            public Dictionary<int, double> MachineDurations { get; set; } // Duration per machine
        }

        private class JobModel
        {
            public int JobId { get; set; }
            public List<OperationModel> MachineList { get; set; }
        }

        public async Task SolveTasks()
        {
            // Example jobs (Replace with database retrieval logic)
            List<JobModel> allJobs = GetExampleJobs();

            double horizon = allJobs.Sum(job => job.MachineList.Sum(task => task.MachineDurations.Values.Max()));
            CpModel model = new CpModel();

            // Store tasks and intervals
            Dictionary<Tuple<int, int, int>, Tuple<IntVar, IntVar, IntervalVar>> allTasks = new Dictionary<Tuple<int, int, int>, Tuple<IntVar, IntVar, IntervalVar>>();
            Dictionary<int, List<IntervalVar>> machineToIntervals = GetMachinesToIntervals(allJobs, allTasks, horizon, model);

            // Add no-overlap constraints
            foreach (var machine in machineToIntervals.Keys)
            {
                model.AddNoOverlap(machineToIntervals[machine]);
            }

            // Add precedence constraints
            foreach (var job in allJobs)
            {
                for (int i = 0; i < job.MachineList.Count - 1; i++)
                {
                    foreach (var machine1 in job.MachineList[i].MachineOptions)
                    {
                        foreach (var machine2 in job.MachineList[i + 1].MachineOptions)
                        {
                            var keyCurrent = Tuple.Create(job.JobId, job.MachineList[i].OperationNumber, machine1);
                            var keyNext = Tuple.Create(job.JobId, job.MachineList[i + 1].OperationNumber, machine2);
                            model.Add(allTasks[keyNext].Item1 >= allTasks[keyCurrent].Item2);
                        }
                    }
                }
            }

            // Minimize makespan
            IntVar makespan = model.NewIntVar(0, (long)horizon, "makespan");
            List<IntVar> taskEndTimes = new List<IntVar>();
            foreach (var job in allJobs)
            {
                foreach (var machine in job.MachineList.Last().MachineOptions)
                {
                    var key = Tuple.Create(job.JobId, job.MachineList.Last().OperationNumber, machine);
                    taskEndTimes.Add(allTasks[key].Item2);
                }
            }
            model.AddMaxEquality(makespan, taskEndTimes);
            model.Minimize(makespan);

            // Solve the model
            CpSolver solver = new CpSolver();
            CpSolverStatus status = solver.Solve(model);

            // Output results
            if (status == CpSolverStatus.Optimal || status == CpSolverStatus.Feasible)
            {
                Console.WriteLine($"Optimal Makespan: {solver.ObjectiveValue}");
                foreach (var job in allJobs)
                {
                    foreach (var task in job.MachineList)
                    {
                        foreach (var machine in task.MachineOptions)
                        {
                            var key = Tuple.Create(job.JobId, task.OperationNumber, machine);
                            BoolVar isMachineSelected = model.NewBoolVar($"select_machine_{machine}_for_task_{task.OperationNumber}");

                            if (solver.BooleanValue(isMachineSelected))
                            {
                                int start = (int)solver.Value(allTasks[key].Item1);
                                int duration = (int)task.MachineDurations[machine];
                                Console.WriteLine($"Job {job.JobId}, Task {task.OperationNumber} on Machine {machine} starts at {start} and ends at {start + duration}");
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

        private Dictionary<int, List<IntervalVar>> GetMachinesToIntervals(
            List<JobModel> allJobs,
            Dictionary<Tuple<int, int, int>, Tuple<IntVar, IntVar, IntervalVar>> allTasks,
            double horizon,
            CpModel model)
        {
            Dictionary<int, List<IntervalVar>> machineToIntervals = new Dictionary<int, List<IntervalVar>>();

            foreach (var job in allJobs)
            {
                foreach (var task in job.MachineList)
                {
                    foreach (var machine in task.MachineOptions)
                    {
                        string suffix = $"_{job.JobId}_{task.OperationNumber}_machine_{machine}";
                        IntVar start = model.NewIntVar(0, (long)horizon, "start" + suffix);
                        IntVar end = model.NewIntVar(0, (long)horizon, "end" + suffix);
                        double duration = task.MachineDurations[machine];
                        IntervalVar interval = model.NewIntervalVar(start, (int)duration, end, "interval" + suffix);

                        var key = Tuple.Create(job.JobId, task.OperationNumber, machine);
                        allTasks[key] = Tuple.Create(start, end, interval);

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

        private  List<JobModel> GetExampleJobs()
        {
            return new List<JobModel>
            {
                new JobModel
                {
                    JobId = 1,
                    MachineList = new List<OperationModel>
                    {
                        new OperationModel
                        {
                            OperationNumber = 1,
                            MachineOptions = new List<int> { 1, 2 },
                            MachineDurations = new Dictionary<int, double> { { 1, 5.0 }, { 2, 6.0 } }
                        },
                        new OperationModel
                        {
                            OperationNumber = 2,
                            MachineOptions = new List<int> { 2, 3 },
                            MachineDurations = new Dictionary<int, double> { { 2, 4.0 }, { 3, 7.0 } }
                        }
                    }
                },
                new JobModel
                {
                    JobId = 2,
                    MachineList = new List<OperationModel>
                    {
                        new OperationModel
                        {
                            OperationNumber = 1,
                            MachineOptions = new List<int> { 1, 3 },
                            MachineDurations = new Dictionary<int, double> { { 1, 3.0 }, { 3, 4.5 } }
                        },
                        new OperationModel
                        {
                            OperationNumber = 2,
                            MachineOptions = new List<int> { 2, 3 },
                            MachineDurations = new Dictionary<int, double> { { 2, 5.0 }, { 3, 6.0 } }
                        }
                    }
                }
            };
        }
    }
}
