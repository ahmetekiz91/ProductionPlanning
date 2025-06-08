using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules.AntColony
{
    public class ACOTSP
    {
        private double[,] distances;
        private double[,] pheromones;
        private int numCities;
        private int numAnts;
        private double alpha;
        private double beta;
        private double evaporation;
        private double pheromoneInitial;
        private Random random;

        public ACOTSP(double[,] distances, int numAnts, double alpha, double beta, double evaporation, double pheromoneInitial)
        {
            this.distances = distances;
            this.numCities = distances.GetLength(0);
            this.numAnts = numAnts;
            this.alpha = alpha;
            this.beta = beta;
            this.evaporation = evaporation;
            this.pheromoneInitial = pheromoneInitial;
            this.pheromones = InitializePheromones(numCities, pheromoneInitial);
            this.random = new Random();
        }

        public (List<int> path, double distance) Run(int iterations)
        {
            List<int> bestPath = null;
            double bestDistance = double.MaxValue;

            for (int iter = 0; iter < iterations; iter++)
            {
                List<List<int>> allPaths = new List<List<int>>();
                List<double> allDistances = new List<double>();

                for (int ant = 0; ant < numAnts; ant++)
                {
                    var path = GeneratePath();
                    double distance = CalculateDistance(path);

                    allPaths.Add(path);
                    allDistances.Add(distance);

                    if (distance < bestDistance)
                    {
                        bestDistance = distance;
                        bestPath = path;
                    }
                }

                UpdatePheromones(allPaths, allDistances);
            }

            return (bestPath, bestDistance);
        }

        private List<int> GeneratePath()
        {
            List<int> path = new List<int>();
            HashSet<int> visited = new HashSet<int>();

            int currentCity = random.Next(numCities);
            path.Add(currentCity);
            visited.Add(currentCity);

            while (path.Count < numCities)
            {
                int nextCity = ChooseNextCity(currentCity, visited);
                path.Add(nextCity);
                visited.Add(nextCity);
                currentCity = nextCity;
            }

            return path;
        }

        private int ChooseNextCity(int currentCity, HashSet<int> visited)
        {
            double[] probabilities = new double[numCities];
            double total = 0.0;
            for (int i = 0; i < numCities; i++)
            {
                if (visited.Contains(i))
                {
                    probabilities[i] = 0.0;
                }
                else
                {
                    probabilities[i] = Math.Pow(pheromones[currentCity, i], alpha) * Math.Pow(1.0 / distances[currentCity, i], beta);
                    total += probabilities[i];
                }
            }
            double rand = random.NextDouble() * total;
            double cumulative = 0.0;

            for (int i = 0; i < numCities; i++)
            {
                cumulative += probabilities[i];
                if (rand <= cumulative)
                {
                    return i;
                }
            }

            return 0;  // Should not reach here
        }

        private double CalculateDistance(List<int> path)
        {
            double distance = 0.0;

            for (int i = 0; i < path.Count - 1; i++)
            {
                distance += distances[path[i], path[i + 1]];
            }

            distance += distances[path[path.Count - 1], path[0]]; // Return to starting city
            return distance;
        }

        private void UpdatePheromones(List<List<int>> allPaths, List<double> allDistances)
        {
            // Evaporate pheromones
            for (int i = 0; i < numCities; i++)
            {
                for (int j = 0; j < numCities; j++)
                {
                    pheromones[i, j] *= (1.0 - evaporation);
                }
            }

            // Add new pheromones
            for (int k = 0; k < allPaths.Count; k++)
            {
                var path = allPaths[k];
                double distance = allDistances[k];
                double contribution = 1.0 / distance;

                for (int i = 0; i < path.Count - 1; i++)
                {
                    pheromones[path[i], path[i + 1]] += contribution;
                    pheromones[path[i + 1], path[i]] += contribution;
                }

                // Add return path
                pheromones[path[path.Count - 1], path[0]] += contribution;
                pheromones[path[0], path[path.Count - 1]] += contribution;
            }
        }

        private double[,] InitializePheromones(int size, double initial)
        {
            double[,] pheromones = new double[size, size];
            for (int i = 0; i < size; i++)
            {
                for (int j = 0; j < size; j++)
                {
                    pheromones[i, j] = initial;
                }
            }
            return pheromones;
        }
    }

}
