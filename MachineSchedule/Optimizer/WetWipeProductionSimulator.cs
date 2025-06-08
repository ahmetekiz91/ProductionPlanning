using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules
{
    public class WetWipeProductionSimulator
    {
        // 1. Mixer Calculation
        public static decimal? CalculateMixerTime(decimal? processTime, decimal? waitingTime)
        {

            return processTime + waitingTime;
        }

        // 2. Vacuum Mixer Calculation
        public static decimal? CalculateVacuumMixerTime(decimal? processTime, decimal? waitingTime)
        {

            return processTime + waitingTime;
        }

        // 3. Filtration System Calculation
        public static decimal? CalculateFiltrationTime(decimal? processTime, decimal? waitingTime)
        {

            return processTime + waitingTime;
        }

        // 4. Roll Cutting Machine Calculation
        public static decimal? CalculateRollCuttingTime(decimal? units, decimal? processTime, decimal? waitingTime)
        {
            return units * (processTime + waitingTime);
        }

        // 5. Solution Soaking Machine Calculation
        public static decimal? CalculateSoakingTime(decimal? units, decimal? processTime, decimal? waitingTime)
        {
            return units * (processTime + waitingTime);
        }

        // 6. Folding Machine Calculation
        public static decimal? CalculateFoldingTime(decimal? units, decimal? processTime, decimal? waitingTime)
        {
            return units * (processTime + waitingTime);
        }

        // 7. Packaging Machine Calculation
        public static decimal? CalculatePackagingTime(decimal? units, decimal? processTime, decimal? waitingTime)
        {

            return units * (processTime + waitingTime);
        }

        // 8. Shrink Wrapping Machine Calculation
        public static decimal? CalculateShrinkWrappingTime(decimal? packages, decimal? processTime, decimal? waitingTime)
        {

            return packages * (processTime + waitingTime);
        }

        // 9. Cartoning Machine Calculation
        public static decimal? CalculateCartoningTime(decimal? cartons, decimal? processTime, decimal? waitingTime)
        {
            return cartons * (processTime + waitingTime);
        }
    }
}
