using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules
{
    public class ShampooProductionCalculator
    {
        public ShampooProductionCalculator()
        {
        }

        // 1. Mixer Time Calculation
        public static decimal? CalculateMixerTime(decimal? processTime, decimal? waitingTime)
        {
            return processTime + waitingTime;
        }

        // 2. Vacuum Mixer Time Calculation
        public static decimal? CalculateVacuumMixerTime(decimal? processTime, decimal? waitingTime)
        {

            return processTime + waitingTime;
        }

        // 3. Filtration System Time Calculation
        public static decimal? CalculateFiltrationTime(decimal? processTime, decimal? waitingTime)
        {
            return processTime + waitingTime;
        }

        // 4. Filling Machine Time Calculation
        public static decimal? CalculateFillingTime(decimal? bottleCount, decimal? processTimePerBottle, decimal? waitingTime)
        {

            return (processTimePerBottle + waitingTime) * bottleCount;
        }

        // 5. Cap Placement Machine Time Calculation
        public static decimal? CalculateCapPlacementTime(decimal? bottleCount, decimal? processTimePerBottle, decimal? waitingTime)
        {
            if (bottleCount == null || processTimePerBottle == null || waitingTime == null)
                throw new ArgumentException("Bottle count, process time per bottle, and waiting time cannot be null.");

            return (processTimePerBottle + waitingTime) * bottleCount;
        }

        // 6. Cap Tightening Machine Time Calculation
        public static decimal? CalculateCapTighteningTime(decimal? bottleCount, decimal? processTimePerBottle, decimal? waitingTime)
        {
            if (bottleCount == null || processTimePerBottle == null || waitingTime == null)
                throw new ArgumentException("Bottle count, process time per bottle, and waiting time cannot be null.");

            return (processTimePerBottle + waitingTime) * bottleCount;
        }

        // 7. Labeling Machine Time Calculation
        public static decimal? CalculateLabelingTime(decimal? bottleCount, decimal? processTimePerBottle, decimal? waitingTime)
        {
            if (bottleCount == null || processTimePerBottle == null || waitingTime == null)
                throw new ArgumentException("Bottle count, process time per bottle, and waiting time cannot be null.");

            return (processTimePerBottle + waitingTime) * bottleCount;
        }

        // 8. Shrink Wrapping Machine Time Calculation
        public static decimal? CalculateShrinkWrappingTime(decimal? packageCount, decimal? processTimePerPackage, decimal? waitingTime)
        {
            if (packageCount == null || processTimePerPackage == null || waitingTime == null)
                throw new ArgumentException("Package count, process time per package, and waiting time cannot be null.");

            return (processTimePerPackage + waitingTime) * packageCount;
        }

        // 9. Cartoning Machine Time Calculation
        public static decimal? CalculateCartoningTime(decimal? cartonCount, decimal? processTimePerCarton, decimal? waitingTime)
        {

            return (processTimePerCarton + waitingTime) * cartonCount;
        }
    }

}
