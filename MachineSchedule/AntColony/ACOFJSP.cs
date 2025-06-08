using System;
using System.Collections.Generic;
using System.ComponentModel;

public class ACOFJSP
{
    public double[,] initial;
    public double[,] pheromones;
    public double[,] heuristic;
    public List<(int, List<int>)> jobs { get; set; }
    public List<(int, List<int>)> submachines;
    public List<(int, int, decimal)> operations;
    public Random random;
    private int numofJobs { get { return jobs.Count; } }
    public double alpha;
    public double beta;
    public double evaporationRate; //Evaporation rate for pheromone update
    public double Q; //Scaling factor for pheromone reinforcement
    private int stepscount = 0;

    public ACOFJSP(List<(int, List<int>)> jobs, List<(int, List<int>)> submachines, List<(int, int, decimal)> operations, double[,] initial, double alpha, double beta, double evaporationRate, double Q)
    {
        this.jobs = jobs;
        this.stepscount = 9;
        this.submachines = submachines;
        this.operations = operations;
        this.alpha = alpha;
        this.beta = beta;
        this.initial = initial;
        this.random = new Random();
        this.pheromones = InitializePheromones(numofJobs, stepscount, 1);
        this.evaporationRate = evaporationRate;
        this.Q = Q;
        this.pheromones = getPheromone();
        this.heuristic = getHeuristic();

    }

    private double[,] InitializePheromones(int xlen, int ylen, double initial)
    {
        double[,] pheromones = new double[xlen, ylen];
        for (int i = 0; i < xlen; i++)
        {
            for (int j = 0; j < ylen; j++)
            {
                pheromones[i, j] = initial;
            }
        }
        return pheromones;
    }

    public double[,] getPheromone()
    {
        var phe = new double[numofJobs, stepscount];
        for (int i = 0; i < numofJobs; i++)
        {
            for (int j = 0; j < stepscount; j++)
            {

                phe[i, j] = 1.0;
            }
        }
        return phe;
    }

    public double[,] getHeuristic()
    {
        var heuristic = new double[numofJobs, stepscount];
        for (int i = 0; i < numofJobs; i++)
        {
            for (int j = 0; j < stepscount; j++)
            {
                var obj = submachines.Where(v => v.Item1 == j + 1).First();
                int submachineId = obj.Item2[random.Next(0, obj.Item2.Count)];
                var heuristicobj = operations.Where(b => b.Item1 == jobs[i].Item1 && b.Item2 == submachineId).First();
                heuristic[i, j] = (double)(1 / heuristicobj.Item3);
            }
        }
        return heuristic;
    }

    public List<(int,int,int,double)> CalculateProbabilities()
    {
        List<(int, int, int, double)> probabilities = new List<(int, int, int, double)>();

        for (int i = 0; i < jobs.Count; i++) // Jobs
        {
            for (int j = 0; j < stepscount; j++) // Opeations
            {
                var submachineInfo = submachines.FirstOrDefault(v => v.Item1 == j + 1);
                // values for calculation
                double numeratorSum = 0.0;
                double numerator = 0.0;
                Dictionary<int, double> numerators = new Dictionary<int, double>();
                var shuffedlist = submachineInfo.Item2.OrderBy(x => random.Next()).ToList();
                foreach (var submachineId in shuffedlist)
                {
                    double tau = pheromones[i, j];
                    double eta = heuristic[i, j];
                    numerator = Math.Pow(tau, alpha) * Math.Pow(eta, beta);
                    numeratorSum += numerator;
                    numerators[submachineId] = numerator;
                }
                foreach (var submachineId in shuffedlist)
                {
                    probabilities.Add((i, j + 1,submachineId, numerators[submachineId] / numeratorSum));
                }
            }
        }

        return probabilities;
    }

    public List<(int, List<int>)> ConstructSolution(List<(int, int, int, double)> probabilities)
    {
        List<(int, List<int>)> solution = new List<(int, List<int>)>();

        Random random = new Random();

        for (int i = 0; i < jobs.Count; i++) // Iterate over jobs
        {
            List<int> solutionsteps = new List<int>();
            for (int j = 0; j < jobs[i].Item2.Count; j++) // Iterate over operations
            {
                var submachineInfo = submachines.Where(v => v.Item1 == j + 1).FirstOrDefault();
                // Retrieve probabilities for the operation
                List<double> cumulativeProbabilities = new List<double>();
                double cumulativeSum = 0.0;

                foreach (var submachineId in submachineInfo.Item2)
                {
                    var obj = probabilities.Where(q => q.Item1 == i && q.Item2 == j+1 && q.Item3 == submachineId).First();
                    cumulativeSum += obj.Item4;
                    cumulativeProbabilities.Add(cumulativeSum);
                }
                //cumulativeProbabilities = cumulativeProbabilities.OrderBy(x => random.Next()).ToList();
                // Generate a random number and select a submachine
                double r = random.NextDouble();
                for (int k = 0; k < cumulativeProbabilities.Count; k++)
                {
                    if (r <= cumulativeProbabilities[k])
                    {
                        solutionsteps.Add(submachineInfo.Item2[k]);

                        break;
                    }
                }
            }
            solution.Add((jobs[i].Item1, solutionsteps));
        }

        return solution;
    }

    public decimal EvaluateSolution(List<(int, List<int>)> solution)
    {
        decimal totalsum = 0m;
        List<(int, decimal)> checklist = new List<(int, decimal)> ();

        for (int i = 0; i < solution.Count; i++)
        {
            for (int j = 0; j < solution[i].Item2.Count; j++)
            {
                int submachineId = solution[i].Item2[j];
                var submachineInfo = submachines.Where(v => v.Item1 == j + 1).FirstOrDefault();
                var span = operations.Where(b => b.Item1 == jobs[i].Item1 && b.Item2 == submachineId).First().Item3;
                //if machine assigned before
                checklist.Add((submachineId, span));
                decimal previous = checklist.Where(v => v.Item1 == submachineId).Sum(b => b.Item2);
                totalsum += (span+ previous)/60;//convert from second to minute
            }
        }
        return totalsum;
    }

    public void UpdatePheromones(List<(int, List<int>)> solution, decimal solutionQuality)
    {
        // Evaporate pheromones
        for (int i = 0; i < pheromones.GetLength(0); i++)
        {
            for (int j = 0; j < pheromones.GetLength(1); j++)
            {
                pheromones[i, j] *= (1 - evaporationRate); // Apply evaporation rate
            }
        }
        // Reinforce pheromones based on solution quality
        for (int i = 0; i < solution.Count; i++)
        {
            int jobId = solution[i].Item1;
            for (int j = 0; j < solution[i].Item2.Count; j++)
            {
                int submachineId = solution[i].Item2[j];
                pheromones[i, j] += (Q / (double)solutionQuality); // Reinforcement
            }
        }
    }

    public (List<(int, List<int>)> bestSolution, decimal bestMakespan) Run(int iterations, int numAnts)
    {
        List<(int, List<int>)> bestSolution = null;
        decimal bestMakespan = decimal.MaxValue;

        for (int iter = 0; iter < iterations; iter++)
        {

            List<List<(int, List<int>)>> allSolutions = new List<List<(int, List<int>)>>();
            List<decimal> allMakespans = new List<decimal>();

            for (int ant = 0; ant < numAnts; ant++)
            {
                // Generate solution for the current ant
                var probabilities = CalculateProbabilities();
                var solution = ConstructSolution(probabilities);
                decimal makespan = EvaluateSolution(solution);

                // Save the solution and its evaluation
                allSolutions.Add(solution);
                allMakespans.Add(makespan);

                // Update the best solution if this one is better
                if (makespan < bestMakespan)
                {
                    bestMakespan = makespan;
                    bestSolution = solution;
                }
            }

            // Update pheromones based on the solutions
            for (int i = 0; i < allSolutions.Count; i++)
            {
                UpdatePheromones(allSolutions[i], allMakespans[i]);
            }

            //Console.WriteLine($"Iteration {iter + 1}/{iterations} - Best Makespan: {bestMakespan}");
        }

        return (bestSolution, bestMakespan);
    }

}