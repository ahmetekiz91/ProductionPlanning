using DBHelper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules.GA
{
    public class GASolver<T>
    {

        private readonly AzadContext context;
        public DateTime startTime { get; set; }
        public GASolver(AzadContext context, DateTime startTime)
        {
            this.context = context;
            this.startTime = startTime;
        }

        public int numberOfMachines { get; set; }

        public int numberofpopulation { get; set; }

        public async Task<List<GAModel>> CreateIndividual()
        {
            try
            {
                List<GAModel> list = new List<GAModel>();

                // select machines and operations from database
                var operations = await new DBOps(this.context).getQueueNumbers(@"SELECT DISTINCT [QueueNumber] FROM ItemProcesses WHERE ProductionLineID IN (1, 2, 3, 4)");

                var operationssubmachines = await new DBOps(this.context).GetItemProcessesAsync(@"SELECT * FROM ItemProcesses WHERE ProductionLineID IN (1, 2, 3, 4)");

                var productionorders = await new DBOps(this.context).getTasks(@"SELECT * FROM ProductionOrder WHERE IsCompleted = 0");

                // create random generator
                Random random = new Random();

                //Process production orders
                foreach (var productionorder in productionorders)
                {
                    foreach (var operation in operations)
                    {
                        var validOptions = operationssubmachines
                            .Where(ip => ip.QueueNumber == operation)
                            .ToList();
                        // choose random object
                        var randomItem = validOptions[random.Next(validOptions.Count)];

                        // create genetic algorithm model
                        var gamodel = new GAModel()
                        {
                            jobId = productionorder.ID,
                            sucMachineId = (int)randomItem.SubMachineID,
                            operationnumber = (int)operation,
                        };

                        // add list
                        list.Add(gamodel);
                    }
                }

                // return connected list
                return list.OrderBy(x => x.jobId).ThenBy(x => x.operationnumber).ToList();
            }
            catch (Exception ex)
            {
                // Add Error message
                throw new Exception("An error occurred while creating the individual: " + ex.Message, ex);
            }
        }

        public async Task<List<List<GAModel>>> CreatePopulations(int numberofpopulation)
        {
            try
            {
                List<List<GAModel>> population = new List<List<GAModel>>();

                for (int i = 0; i < numberofpopulation; i++)
                {
                    // Create each individual
                    var individual = await CreateIndividual();
                    population.Add(individual);
                }

                return population;
            }
            catch (Exception ex)
            {
                // Add Error message
                throw new Exception("An error occurred while creating the populations: " + ex.Message, ex);
            }
        }

        public async Task<decimal> CalculateFitnessAsync(List<GAModel> individual, int numberOfMachines)
        {
            try
            {
                decimal makespan = 0;
                decimal idleTimePenalty = 0;
                decimal loadBalancePenalty = 0;
                decimal conflictPenalty = 0;

                Dictionary<int, decimal> machineLoadTimes = new Dictionary<int, decimal>();
                Dictionary<int, DateTime> machineEndTimes = new Dictionary<int, DateTime>();
                DateTime? earliestStart = null;
                DateTime? latestEnd = null;

                var subMachines = await context.SubMachines.ToDictionaryAsync(v => v.ID);
                var productionOrders = await context.ProductionOrders.ToDictionaryAsync(a => a.ID);
                var machineSchedules = await context.MachineSchedules.Where(v=>v.Algorithm=="GA").OrderByDescending(v => v.EndDate).GroupBy(v => v.MachineId).ToDictionaryAsync(g => g.Key, g => g.FirstOrDefault());

                foreach (var gamodel in individual)
                {
                    int machineId = gamodel.sucMachineId;
                    if (!subMachines.TryGetValue(machineId, out var submachine) || !productionOrders.TryGetValue(gamodel.jobId, out var productionOrder))
                        throw new Exception("SubMachine or ProductionOrder not found");

                    decimal processingTime = (decimal)await new Helper().calculateWaitingtime(context, gamodel.operationnumber, submachine, productionOrder);

                    decimal currentLoad = machineLoadTimes.ContainsKey(machineId) ? machineLoadTimes[machineId] : 0;
                    DateTime currentEndTime = machineEndTimes.ContainsKey(machineId) ? machineEndTimes[machineId] : startTime;
                    DateTime latestScheduledEndTime = machineSchedules.TryGetValue(machineId, out var schedule) ? (DateTime)schedule.EndDate : startTime;
                    DateTime jobStartTime = latestScheduledEndTime > currentEndTime ? latestScheduledEndTime : currentEndTime;
                    DateTime jobEndTime = jobStartTime.AddMinutes((double)processingTime);

                    machineLoadTimes[machineId] = currentLoad + processingTime;
                    machineEndTimes[machineId] = jobEndTime;

                    if (earliestStart == null || jobStartTime < earliestStart) earliestStart = jobStartTime;
                    if (latestEnd == null || jobEndTime > latestEnd) latestEnd = jobEndTime;
                }

                makespan = (decimal)(latestEnd - earliestStart)?.TotalMinutes;

                decimal maxLoad = machineLoadTimes.Values.Max();
                decimal minLoad = machineLoadTimes.Values.Min();
                loadBalancePenalty = maxLoad - minLoad;

                foreach (var machine in machineLoadTimes)
                {
                    if (machine.Value > 22 * 60)
                    {
                        conflictPenalty += 1;
                    }
                }

                decimal fitness = makespan;

                return fitness;
            }
            catch (Exception ex)
            {
                throw new Exception($"Fitness calculation failed: {ex.Message}", ex);
            }
        }
        public decimal CalculateDynamicThreshold(Dictionary<int, decimal> machineLoads)
        {
            decimal averageLoad = machineLoads.Values.Average();
            decimal maxLoad = machineLoads.Values.Max();
            decimal standardDeviation = (decimal)Math.Sqrt(machineLoads.Values.Select(load => Math.Pow((double)(load - averageLoad), 2)).Average());
            //dynamic threshold formula
            decimal threshold = averageLoad + (2 * standardDeviation);

            return Math.Min(threshold, maxLoad * 0.8m);
        }

        public async Task<List<List<GAModel>>> Crossover(List<GAModel> parent1, List<GAModel> parent2)
        {
            int crossoverpoint = parent1.Count / 2;
            List<GAModel> offspring1 = new List<GAModel>();
            List<GAModel> offspring2 = new List<GAModel>();
            for (int i = 0; i < crossoverpoint; i++)
            {
                GAModel gen = new GAModel();
                gen.operationnumber = parent2[i].operationnumber;
                gen.sucMachineId = parent2[i].sucMachineId;
                gen.jobId = parent1[i].jobId;
                offspring1.Add(gen);
            }
            for (int i = crossoverpoint; i < parent1.Count; i++)
            {
                GAModel gen2 = new GAModel();
                gen2.operationnumber = parent1[i].operationnumber;
                gen2.sucMachineId = parent1[i].sucMachineId;
                gen2.jobId = parent2[i].jobId;
                offspring1.Add(gen2);
            }

            for (int i = 0; i < crossoverpoint; i++)
            {
                GAModel gen3 = new GAModel();
                gen3.operationnumber = parent1[i].operationnumber;
                gen3.sucMachineId = parent1[i].sucMachineId;
                gen3.jobId = parent2[i].jobId;
                offspring2.Add(gen3);
            }
            for (int i = crossoverpoint; i < parent1.Count; i++)
            {
                GAModel gen4 = new GAModel();
                gen4.operationnumber = parent2[i].operationnumber;
                gen4.sucMachineId = parent2[i].sucMachineId;
                gen4.jobId = parent1[i].jobId;
                offspring2.Add(gen4);
            }
            return new List<List<GAModel>> { offspring1, offspring2 };

        }

        public async Task<(List<GAModel>, List<GAModel>)> MutateBetweenIndividualsWithDonor(List<GAModel> individual, List<List<GAModel>> population)
        {
            Random rand = new Random();

            // Ensure there's more than one individual in the population
            if (population.Count <= 1)
                throw new InvalidOperationException("Population must contain more than one individual.");

            // Select a random donor individual from the population
            List<GAModel> donorIndividual;
            do
            {
                donorIndividual = population[rand.Next(population.Count)];
            }
            while (donorIndividual == individual); // Avoid selecting the same individual as donor

            // Select a random step
            int randomStep = rand.Next(individual.Count);

            // Get genes for mutation
            GAModel genIn = individual[randomStep];
            GAModel genDonor = donorIndividual[randomStep];

            // Create new genes by swapping the machine assignments
            GAModel newGen = new GAModel()
            {
                jobId = genIn.jobId,
                operationnumber = genIn.operationnumber,
                sucMachineId = genDonor.sucMachineId
            };

            GAModel newGen2 = new GAModel()
            {
                jobId = genDonor.jobId,
                operationnumber = genDonor.operationnumber,
                sucMachineId = genIn.sucMachineId
            };

            // Replace the genes in the individuals
            individual[randomStep] = newGen;
            donorIndividual[randomStep] = newGen2;

            // Ensure operation order is maintained
            individual = individual.OrderBy(x => x.operationnumber).ToList();
            donorIndividual = donorIndividual.OrderBy(x => x.operationnumber).ToList();

            return (individual, donorIndividual);
        }

        public async Task RunGA(int generations, int populationSize)
        {
            try
            {
                Random rand = new Random();

                double mutationRate = 0.2;

                var population = await CreatePopulations(populationSize);
                List<GAModel> bestIndividual = null;
                decimal bestFitness = decimal.MaxValue;

                for (int generation = 0; generation < generations; generation++)
                {
                    var fitnessResults = new List<(List<GAModel>, decimal)>();
                    foreach (var individual in population)
                    {
                        var fitness = await CalculateFitnessAsync(individual, numberOfMachines);
                        fitnessResults.Add((individual, fitness));
                    }

                    fitnessResults = fitnessResults.OrderBy(fr => fr.Item2).ToList();

                    if (fitnessResults[0].Item2 < bestFitness)
                    {
                        bestFitness = fitnessResults[0].Item2;
                        bestIndividual = fitnessResults[0].Item1;
                    }

                    var topIndividuals = fitnessResults.Take(2).Select(fr => fr.Item1).ToList();
                    var newPopulation = new List<List<GAModel>>(topIndividuals);

                    while (newPopulation.Count < populationSize)
                    {
                        var offspring = await Crossover(topIndividuals[0], topIndividuals[1]);

                        if (rand.NextDouble() < mutationRate)
                        {
                            var (mutatedOffspring1, _) = await MutateBetweenIndividualsWithDonor(offspring[0], population);
                            offspring[0] = mutatedOffspring1;
                        }

                        if (rand.NextDouble() < mutationRate)
                        {
                            var (_, mutatedOffspring2) = await MutateBetweenIndividualsWithDonor(offspring[1], population);
                            offspring[1] = mutatedOffspring2;
                        }

                        newPopulation.AddRange(offspring);
                    }

                    population = newPopulation.Take(populationSize).ToList();
                    Console.WriteLine($"Generation {generation + 1}: Best Fitness = {fitnessResults[0].Item2}");
                }

                var (saveSuccess, makespan) = await SaveBestGAIndividualToDB(bestIndividual);

                if (saveSuccess)
                {
                    //Console.WriteLine("GA schedule saved successfully.");
                    //Console.WriteLine($"Makespan (GA): {makespan.TotalMinutes:F2} minutes");
                }
                else
                {
                    Console.WriteLine("GA schedule save failed.");
                }

                Console.WriteLine("Genetic Algorithm Complete.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error running Genetic Algorithm: {ex.Message}");
            }
        }

        private async Task<(bool Success, TimeSpan Makespan)> SaveBestGAIndividualToDB(List<GAModel> schedule)
        {
            try
            {
                var productionOrders = await context.ProductionOrders.ToDictionaryAsync(p => p.ID);
                var subMachines = await context.SubMachines.ToDictionaryAsync(m => m.ID);

                var orderedSchedule = schedule
                    .OrderBy(s => s.jobId)
                    .ThenBy(s => s.operationnumber)
                    .ToList();

                var jobLastEndTime = new Dictionary<int, DateTime>();
                var machineLastEndTime = new Dictionary<int, DateTime>();

                DateTime? firstStartTime = this.startTime;
                DateTime? lastEndTime = null;

                foreach (var task in orderedSchedule)
                {
                    if (!productionOrders.TryGetValue(task.jobId, out var productionOrder))
                        throw new Exception($"ProductionOrder not found for JobId {task.jobId}");

                    if (!subMachines.TryGetValue(task.sucMachineId, out var subMachine))
                        throw new Exception($"SubMachine not found for ID {task.sucMachineId}");

                    var duration = (decimal)await new Helper().calculateWaitingtime(context, task.operationnumber, subMachine, productionOrder);
                    var minutes = (double)duration / 60;

                    DateTime startTime = DateTime.Now;
                    if (jobLastEndTime.TryGetValue(task.jobId, out var jobEnd))
                        startTime = jobEnd;

                    if (machineLastEndTime.TryGetValue(task.sucMachineId, out var machineEnd))
                        startTime = (startTime > machineEnd) ? startTime : machineEnd;

                    DateTime endTime = startTime.AddMinutes(minutes);

                    var ms = new MachineSchedule
                    {
                        POID = productionOrder.ID,
                        MachineId = subMachine.ID,
                        ItemID = productionOrder.ItemID,
                        UnitID = productionOrder.UnitID,
                        Amount = productionOrder.Amount,
                        WaitingTime = duration / 60,
                        StartDate = startTime,
                        EndDate = endTime,
                        QueueNumber = subMachine.QueueNumber,
                        Algorithm = "GA"
                    };

                    context.MachineSchedules.Add(ms);
                    await context.SaveChangesAsync();

                    MachineSchedulerunninginfos machineSchedule = new MachineSchedulerunninginfos
                    {
                        POID = productionOrder.ID,
                        MachineId = subMachine.ID,
                        ItemID = productionOrder.ItemID,
                        UnitID = productionOrder.UnitID,
                        Amount = productionOrder.Amount,
                        WaitingTime = duration / 60,
                        StartDate = startTime,
                        EndDate = endTime,
                        QueueNumber = subMachine.QueueNumber,
                        Algorithm = "GA"
                    };

                    context.MachineSchedulerunninginfos.Add(machineSchedule);
                    await context.SaveChangesAsync();


                    jobLastEndTime[task.jobId] = endTime;
                    machineLastEndTime[task.sucMachineId] = endTime;

                    // Track makespan boundaries
                    if (firstStartTime == null || startTime < firstStartTime)
                        firstStartTime = startTime;
                    if (lastEndTime == null || endTime > lastEndTime)
                        lastEndTime = endTime;
                }

                
                TimeSpan makespan = (firstStartTime != null && lastEndTime != null) ? lastEndTime.Value - firstStartTime.Value : TimeSpan.Zero;

                return (true, makespan);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error saving GA schedule: " + ex.Message);
                return (false, TimeSpan.Zero);
            }
        }

    }
}