
using DBHelper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules
{
    public class Helper
    {
        public async Task<decimal?> calculateWaitingtime(AzadContext azadContext, int i, SubMachines? filteredSubMachine, ProductionOrder productionOrder)
        {
            try
            {
                var unititem = await azadContext.Items.Where(v => v.ID == productionOrder.ItemID).FirstAsync();
                decimal waitingTime = 0m;
                decimal? cartonWeight = unititem.Weight * unititem.UnitPerBox;
                decimal? cartonCount = productionOrder.Amount;
                decimal? totalUnits = cartonCount * unititem.UnitPerBox;
                decimal? totalPackages = totalUnits / unititem.PCSAmount;

                if (unititem.IGID == 1)
                {
                    if (i == 1) waitingTime = (decimal)ProductionCalculator.CalculateMixerTime(filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 2) waitingTime = (decimal)ProductionCalculator.CalculateHeaterTime(filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 3) waitingTime = (decimal)ProductionCalculator.CalculateCuttingTime(filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 4) waitingTime = (decimal)ProductionCalculator.CalculateSoakingTime(totalUnits, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 5) waitingTime = (decimal)ProductionCalculator.CalculateFoldingTime(totalUnits, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 6) waitingTime = (decimal)ProductionCalculator.CalculatePackagingTime(totalPackages, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 7) waitingTime = (decimal)ProductionCalculator.CalculateSealingTime(totalUnits, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 8) waitingTime = (decimal)ProductionCalculator.CalculateShrinkWrappingTime(totalPackages, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 9) waitingTime = (decimal)ProductionCalculator.CalculateCartoningTime(cartonCount, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                }
                if (unititem.IGID == 13)
                {

                    decimal bootlecount = 3000000 / (decimal)unititem.Weight;
                    decimal? totalcarton = bootlecount / unititem.UnitPerBox;

                    if (i == 1) waitingTime = (decimal)ShampooProductionCalculator.CalculateMixerTime(filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 2) waitingTime = (decimal)ShampooProductionCalculator.CalculateVacuumMixerTime(filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 3) waitingTime = (decimal)ShampooProductionCalculator.CalculateFiltrationTime(filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 4) waitingTime = (decimal)ShampooProductionCalculator.CalculateFillingTime(bootlecount, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 5) waitingTime = (decimal)ShampooProductionCalculator.CalculateCapPlacementTime(bootlecount, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 6) waitingTime = (decimal)ShampooProductionCalculator.CalculateCapTighteningTime(bootlecount, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 7) waitingTime = (decimal)ShampooProductionCalculator.CalculateLabelingTime(bootlecount, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 8) waitingTime = (decimal)ShampooProductionCalculator.CalculateShrinkWrappingTime(totalPackages, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 9) waitingTime = (decimal)ShampooProductionCalculator.CalculateCartoningTime(totalcarton, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                }
                if (unititem.IGID == 20)
                {
                    if (i == 1) waitingTime = (decimal)WetWipeProductionSimulator.CalculateMixerTime(filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 2) waitingTime = (decimal)WetWipeProductionSimulator.CalculateVacuumMixerTime(filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 3) waitingTime = (decimal)WetWipeProductionSimulator.CalculateFiltrationTime(filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 4) waitingTime = (decimal)WetWipeProductionSimulator.CalculateSoakingTime(totalUnits, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 5) waitingTime = (decimal)WetWipeProductionSimulator.CalculateFoldingTime(totalUnits, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 6) waitingTime = (decimal)WetWipeProductionSimulator.CalculatePackagingTime(totalPackages, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 7) waitingTime = (decimal)WetWipeProductionSimulator.CalculatePackagingTime(totalUnits, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 8) waitingTime = (decimal)WetWipeProductionSimulator.CalculateShrinkWrappingTime(totalPackages, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                    if (i == 9) waitingTime = (decimal)WetWipeProductionSimulator.CalculateCartoningTime(cartonCount, filteredSubMachine.ProcessTime, filteredSubMachine.WaitingTime);
                }
                return waitingTime;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
      
        public async Task<List<SubMachines>> Findfilteredsubmachines(AzadContext context, Items item, int operationnumber)
        {
            SubMachines filteredSubMachine = null;
            string wherecond = "";
            if (item.IGID == 1) wherecond += " (1,2,3,4)";

            else if (item.IGID == 13) wherecond += " (5,6,7)";

            else if (item.IGID == 20) wherecond += " (8,9,10)";

            var subMachines = await context.SubMachines.FromSqlRaw("SELECT * FROM SubMachines WHERE PoductionLineID in " + wherecond + " order by QueueNumber,ID ").ToListAsync();
            return subMachines.Where(sub => sub.QueueNumber == operationnumber).ToList();

        }

        public async Task<SubMachines> Findfilteredsubmachine(AzadContext context, Items item, int representativeProcess)
        {
            SubMachines filteredSubMachine = null;
            string wherecond = "";
            if (item.IGID == 1) wherecond += " (1,2,3,4)";

            else if (item.IGID == 13) wherecond += " (5,6,7)";

            else if (item.IGID == 20) wherecond += " (8,9,10)";

            var subMachines = await context.SubMachines.FromSqlRaw("SELECT * FROM SubMachines WHERE PoductionLineID in " + wherecond + " order by QueueNumber,ID ").ToListAsync();
            var filteredSubMachines = subMachines.Where(sub => sub.QueueNumber == representativeProcess);

            DateTime dtmin = DateTime.MaxValue;
            foreach (var submachine in filteredSubMachines)
            {
                try
                {
                    // Attempt to retrieve the latest schedule for the submachine
                    var latestSchedule = await context.MachineSchedules.Where(v => v.MachineId == submachine.ID).
                        OrderByDescending(v => v.EndDate).FirstOrDefaultAsync(); // Use FirstOrDefault to handle empty results
                    DateTime latestDate = latestSchedule?.EndDate ?? DateTime.MinValue; // Use MinValue if no schedule exists
                    // Compare and update if this submachine has the earliest available time
                    if (latestDate < dtmin)
                    {
                        filteredSubMachine = submachine;
                        dtmin = latestDate;
                    }
                }
                catch (Exception ex)
                {
                    // Log or handle the error
                    Console.WriteLine($"Error processing submachine {submachine.ID}: {ex.Message}");
                    continue; // Skip to the next submachine
                }
            }
            if (filteredSubMachine == null)
            {
                filteredSubMachine = filteredSubMachines.FirstOrDefault();
            }
            return filteredSubMachine;
        }

    }
}
