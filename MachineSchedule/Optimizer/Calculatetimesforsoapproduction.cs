using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;

namespace MachineSchedules
{
    public class ProductionCalculator
    {
        public ProductionCalculator()
        {

        }
        public static decimal? CalculateMixerTime(decimal? processTime, decimal? waitingTime)
        {
            return processTime + waitingTime;
        }
        // 2. Heater/Reactor 
        public static decimal? CalculateHeaterTime(decimal? processTime, decimal? waitingTime)
        {
            return processTime + waitingTime;
        }
        // 3. Roll Cutting
        public static decimal? CalculateCuttingTime(decimal? processTime, decimal? waitingTime)
        {
            return processTime + waitingTime;
        }
        // 4. Solution Soaking Machine Süresi Hesaplama
        public static decimal? CalculateSoakingTime(decimal? unitCount, decimal? processTimePerUnit, decimal? waitingTime)
        {
            return unitCount * (processTimePerUnit + waitingTime);
        }
        // 5. Folding Machine Süresi Hesaplama
        public static decimal? CalculateFoldingTime(decimal? unitCount, decimal? processTimePerUnit, decimal? waitingTime)
        {
            return unitCount * (processTimePerUnit + waitingTime);
        }
        // 6. Packaging Machine Süresi Hesaplama
        public static decimal? CalculatePackagingTime(decimal? packageCount, decimal? processTimePerPackage, decimal? waitingTime)
        {
            return packageCount * (processTimePerPackage + waitingTime);
        }

        // 7. Cap Sealing Machine Süresi Hesaplama
        public static decimal? CalculateSealingTime(decimal? unitCount, decimal? processTimePerUnit, decimal? waitingTime)
        {
            return unitCount * (processTimePerUnit + waitingTime);
        }
        // 8. Shrink Wrapping Machine Süresi Hesaplama
        public static decimal? CalculateShrinkWrappingTime(decimal? packageCount, decimal? processTimePerPackage, decimal? waitingTime)
        {
            return packageCount * (processTimePerPackage + waitingTime);
        }
        // 9. Cartoning Machine Süresi Hesaplama
        public static decimal? CalculateCartoningTime(decimal? cartonCount, decimal? processTimePerCarton, decimal? waitingTime)
        {
            return cartonCount * (processTimePerCarton + waitingTime);
        }
    }

}
