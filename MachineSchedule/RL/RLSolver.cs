using DBHelper;
using Google.Protobuf.WellKnownTypes;
using MachineSchedules.GA;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MachineSchedules.RL
{
    public class RLSolver
    {
        public AzadContext context { get; set; }
        public List<RLModel> environment { get; set; }
        public DateTime startDate { get; set; }

        public RLSolver(AzadContext context, DateTime startDate)
        {
            this.context = context;
            this.startDate = startDate;
        }

        public async Task<List<RLModel>> getInitializeEnvironment()
        {
            try
            {
                List<RLModel> list = new List<RLModel>();
                var operations = await new DBOps(this.context).getQueueNumbers(@"SELECT DISTINCT [QueueNumber] FROM ItemProcesses WHERE ProductionLineID IN (1, 2, 3, 4)");
                var operationssubmachines = await new DBOps(this.context).GetItemProcessesAsync(@"SELECT * FROM ItemProcesses WHERE ProductionLineID IN (1, 2, 3, 4)");
                var productionorders = await new DBOps(this.context).getTasks(@"SELECT * FROM ProductionOrder WHERE IsCompleted = 0");

                Random random = new Random();

                foreach (var item in productionorders)
                {
                    foreach (var operation in operations.OrderBy(x => x))
                    {
                        var candidates = operationssubmachines.Where(op => op.QueueNumber == operation).ToList();
                        if (candidates.Count == 0) continue;

                        var selected = candidates[random.Next(candidates.Count)];

                        list.Add(new RLModel
                        {
                            JobId = item.ID,
                            OperationNumber = operation,
                            MachineId = selected.SubMachineID ?? 0
                        });
                    }
                }

                return list.OrderBy(x => x.JobId).ThenBy(b => b.OperationNumber).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the environment: " + ex.Message, ex);
            }
        }

        public async Task<decimal> RewardFunction(int operationId, List<int> availableMachines)
        {
            try
            {
                var submachinelist = await context.SubMachines.ToListAsync();
                var groupedJobs = environment.GroupBy(s => s.JobId)
                    .Select(group => new { JobId = group.Key, Operations = group.ToList() });
                var machineSchedules = await context.MachineSchedules.Where(v=>v.Algorithm=="RL").OrderByDescending(v => v.EndDate).GroupBy(v => v.MachineId).ToDictionaryAsync(g => g.Key, g => g.FirstOrDefault());
                var productionOrders = await context.ProductionOrders.ToListAsync();

                Dictionary<int, decimal> processingTimes = new Dictionary<int, decimal>();

                foreach (var job in groupedJobs)
                {
                    decimal totalProcessingTime = 0m;

                    foreach (var rlmodel in job.Operations.Where(op => op.OperationNumber == operationId))
                    {
                        var productionOrder = productionOrders.FirstOrDefault(a => a.ID == rlmodel.JobId);
                        if (productionOrder == null) continue;

                        var submachine = submachinelist.FirstOrDefault(v => v.ID == rlmodel.MachineId);
                        if (submachine == null) continue;

                        decimal processingTime = (decimal)await new Helper().calculateWaitingtime(context, rlmodel.OperationNumber, submachine, productionOrder);

                        machineSchedules.TryGetValue(submachine.ID, out var latestSchedule);
                        int endTime = latestSchedule?.EndDate != null ? ((DateTime)latestSchedule.EndDate - DateTime.Now).Minutes : 0;
                        totalProcessingTime += processingTime + endTime;
                    }
                    processingTimes[job.JobId] = totalProcessingTime;
                }
                var bestRoute = processingTimes.OrderBy(pt => pt.Value).FirstOrDefault();
                return -bestRoute.Value;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in RewardFunction: {ex.Message}");
                throw new Exception("An error occurred in RewardFunction", ex);
            }
        }

        public async Task TrainAgent(int episodes, double alpha, double gamma, double epsilon, double epsilonDecay)
        {
            var qTable = new Dictionary<(int operationId, int machineId), double>();
            Random random = new Random();

            for (int episode = 1; episode <= episodes; episode++)
            {
                environment = await getInitializeEnvironment();
                var groupedJobs = environment.GroupBy(op => op.JobId);

                foreach (var job in groupedJobs)
                {
                    decimal totalProcessingTime = 0;

                    foreach (var operation in job)
                    {
                        int operationId = operation.OperationNumber;
                        List<int> availableMachines = await context.SubMachines.Select(v => v.ID).ToListAsync();

                        int selectedMachine;
                        if (random.NextDouble() < epsilon)
                        {
                            selectedMachine = availableMachines[random.Next(availableMachines.Count)];
                        }
                        else
                        {
                            selectedMachine = availableMachines.OrderByDescending(machine => GetQValue(qTable, operationId, machine)).First();
                        }
                        decimal reward = await RewardFunction(operationId, new List<int> { selectedMachine });
                        totalProcessingTime += -reward;

                        double currentQ = GetQValue(qTable, operationId, selectedMachine);
                        double maxFutureQ = availableMachines.Max(machine => GetQValue(qTable, operationId, machine));
                        double newQ = currentQ + alpha * ((double)reward + gamma * maxFutureQ - currentQ);
                        qTable[(operationId, selectedMachine)] = newQ;
                    }
                    Console.WriteLine($"Total processing time for Job {job.Key}: {totalProcessingTime:F2}");
                }
                epsilon *= epsilonDecay;
                Console.WriteLine($"Episode {episode}/{episodes} completed. Epsilon: {epsilon:F2}");
            }
            Console.WriteLine("Training Complete!");
        }

        private double GetQValue(Dictionary<(int operationId, int machineId), double> qTable, int operationId, int machineId)
        {
            return qTable.TryGetValue((operationId, machineId), out double value) ? value : 0.0;
        }

        public async Task run(DateTime startDate,int episodes)
        {
            using var context = new AzadContext(); // Ensure your DB context is set up properly

            var rlSolver = new RLSolver(context, startDate);

            // Training parameters
            double alpha = 0.1;
            double gamma = 0.9;
            double epsilon = 1.0;
            double epsilonDecay = 0.99;

            Console.WriteLine("Training the reinforcement learning agent...");
            await rlSolver.TrainAgent(episodes, alpha, gamma, epsilon, epsilonDecay);
            Console.WriteLine("Training completed successfully!");

            // Use the trained environment
            Console.WriteLine("Initializing environment for evaluation...");
            var environment = await rlSolver.getInitializeEnvironment();

            // Optional: display assigned tasks
            foreach (var rlModel in environment)
            {
                Console.WriteLine($"Job ID: {rlModel.JobId}, Machine ID: {rlModel.MachineId}, Operation Number: {rlModel.OperationNumber}");
            }
            environment = environment.OrderBy(x => x.JobId).ThenBy(y => y.OperationNumber).ToList();
            Console.WriteLine("Evaluation completed.");

            // Save and get makespan
            Console.WriteLine("Saving RL schedule to database...");
            var (saved, makespan) = await rlSolver.SaveDBFromRL(environment);

            if (saved)
            {
                Console.WriteLine($"Schedule saved successfully.");
                Console.WriteLine($"Makespan: {makespan.TotalMinutes:F2} minutes");
            }
            else
            {
                Console.WriteLine("Schedule save failed.");
            }
        }

        public async Task<(bool Success, TimeSpan Makespan)> SaveDBFromRL(List<RLModel> schedule)
        {
            try
            {
                var productionOrders = await context.ProductionOrders.ToDictionaryAsync(p => p.ID);
                var subMachines = await context.SubMachines.ToDictionaryAsync(m => m.ID);

                var orderedSchedule = schedule.OrderBy(s => s.JobId).ThenBy(s => s.OperationNumber).ToList();

                var jobLastEndTime = new Dictionary<int, DateTime>();
                var machineLastEndTime = new Dictionary<int, DateTime>();

                DateTime? firstStartTime = this.startDate;
                DateTime? lastEndTime = null;

                foreach (var task in orderedSchedule)
                {
                    if (!productionOrders.TryGetValue(task.JobId, out var productionOrder))
                        throw new Exception($"ProductionOrder not found for JobId {task.JobId}");

                    if (!subMachines.TryGetValue(task.MachineId, out var subMachine))
                        throw new Exception($"SubMachine not found for ID {task.MachineId}");

                    var durationSeconds = (decimal)await new Helper().calculateWaitingtime(context, task.OperationNumber, subMachine, productionOrder);
                    var durationMinutes = (double)durationSeconds / 60.0;

                    DateTime startTime = this.startDate;

                    if (jobLastEndTime.TryGetValue(task.JobId, out var jobEnd))
                        startTime = jobEnd;

                    if (machineLastEndTime.TryGetValue(task.MachineId, out var machineEnd) && machineEnd > startTime)
                        startTime = machineEnd;

                    DateTime endTime = startTime.AddMinutes(durationMinutes);

                    var ms = new MachineSchedule
                    {
                        StartDate = startTime,
                        EndDate = endTime,
                        POID = productionOrder.ID,
                        MachineId = subMachine.ID,
                        Amount = productionOrder.Amount,
                        WaitingTime = durationSeconds / 60,
                        ItemID = productionOrder.ItemID,
                        UnitID = productionOrder.UnitID,
                        QueueNumber = subMachine.QueueNumber,
                        Algorithm = "RL"
                    };

                    context.MachineSchedules.Add(ms);
                    await context.SaveChangesAsync();
                    MachineSchedulerunninginfos machineSchedule = new MachineSchedulerunninginfos
                    {
                        StartDate = startTime,
                        EndDate = endTime,
                        POID = productionOrder.ID,
                        MachineId = subMachine.ID,
                        Amount = productionOrder.Amount,
                        WaitingTime = durationSeconds / 60,
                        ItemID = productionOrder.ItemID,
                        UnitID = productionOrder.UnitID,
                        QueueNumber = subMachine.QueueNumber,
                        Algorithm = "RL"
                    };

                    context.MachineSchedulerunninginfos.Add(machineSchedule);
                    await context.SaveChangesAsync();
                    jobLastEndTime[task.JobId] = endTime;
                    machineLastEndTime[task.MachineId] = endTime;

                    if (firstStartTime == null || startTime < firstStartTime)
                        firstStartTime = startTime;

                    if (lastEndTime == null || endTime > lastEndTime)
                        lastEndTime = endTime;
                }

                TimeSpan makespan = lastEndTime.HasValue && firstStartTime.HasValue
                    ? lastEndTime.Value - firstStartTime.Value
                    : TimeSpan.Zero;

                return (true, makespan);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error saving RL schedule: " + ex.Message);
                return (false, TimeSpan.Zero);
            }
        }

    }
}
