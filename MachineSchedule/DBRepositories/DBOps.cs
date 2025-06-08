
using DBHelper;
using MachineSchedules.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules.DBRepositories
{
    public class DBOps
    {
        private int lunchTime = 720;
        private int dinnerTime = 1080;
        private int breaktime = 60;
        private int onedayhowmanyminutes = 1440;

        public DBOps() 
        { 
        }

        public int amountofoneprocessperday(int totalMinutes) 
        {
            return totalMinutes / onedayhowmanyminutes;
        }

        public int getRemain(int totalMinutes) 
        {
            return totalMinutes % onedayhowmanyminutes;
        }

        public string MinutesToTime(int minutes)
        {
            int hours = (minutes / 60);
            int mins = minutes % 60;
            return $"{hours:D2}:{mins:D2}";
        }
        
        public int calculatetotalbreaktime(int totalMinutes)
        {
            int days = amountofoneprocessperday(totalMinutes);
            int remain = getRemain(totalMinutes);

           return (days * 120) + (remain > lunchTime ? breaktime : 0) + (remain > dinnerTime ? breaktime : 0);
        }
        
        public int calculatetotaldurations(int minutes) 
        {
            return 0;
        }
        
        public int getChecktotalnumberofbreaks(int totalMinutes) 
        {
            int days = amountofoneprocessperday(totalMinutes);
            int remain = getRemain(totalMinutes);
            return (days * 2) + (remain > lunchTime ? 1 : 0) + (remain > dinnerTime ? 1 : 0);
        }
       
        public List<Interval> getBreaks(int totalMinutes)
        {
            int days = amountofoneprocessperday(totalMinutes);
            List<Interval> breaks = new List<Interval>();
            try
            {

                for (int i = 0; i <= days + 1; i++)
                {
                    breaks.Add(new Interval() { start = lunchTime, end = lunchTime + breaktime });
                    breaks.Add(new Interval() { start = dinnerTime, end = dinnerTime + breaktime });
                    lunchTime += onedayhowmanyminutes;
                    dinnerTime += onedayhowmanyminutes;
                }

                return breaks;
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async  Task<List<JobModel>> getAllTasksAsync(int totalTaskTime)
        {
            List<JobModel> jobModels = new List<JobModel>();
            List<Interval> jobs = new List<Interval>();

            int totalMinutes = totalTaskTime;
            int days = totalMinutes / onedayhowmanyminutes;

            List<Interval> breaks = getBreaks(totalTaskTime);
            // Mola sürelerini hesapla
            int totalBreakTime = calculatetotalbreaktime(totalTaskTime);
            totalMinutes += totalBreakTime;
            int checktotalnumber = getChecktotalnumberofbreaks( totalMinutes);
            // Molaları ekle


            // Görevleri işlerken zaman ve mola kontrolü
            int currentTime = 0; // Başlangıç zamanı 00:00
            int breaktimenumber = 0;
    
            foreach (var item in jobModels)
            {
                foreach (var machine in item.machinelist)
                {
                    Interval job = new Interval() { start = currentTime, end = currentTime + (int)machine.duration };
                    int additionalTime = 0;
                    foreach (var breakInterval in breaks)
                    {

                        if (!((job.end < breakInterval.start && job.start < breakInterval.start) ||
                            (breakInterval.end < job.start && breakInterval.start < job.start)))
                        {

                            if (breaktimenumber < checktotalnumber)
                            {
                                additionalTime += breaktime;
                                breaktimenumber++;
                            }
                        }
                    }

                    machine.duration = machine.duration +additionalTime;
                    job.end += additionalTime;
                    currentTime = job.end;
                    Console.WriteLine($"Start = {MinutesToTime(job.start)}, End = {MinutesToTime(job.end)}, Duration: " + machine.duration);
                }
            }


            // Toplam süreyi kontrol et
            if (currentTime == totalMinutes)
            {
                Console.WriteLine("the model is correct");
            }
            else
            {
                Console.WriteLine($"Error: Calculated = {currentTime}, Expected = {totalMinutes}");
            }
            return jobModels;
        }


        public async Task<List<JobModel>> getAllProductionOrder()
        {
            using (var context = new AzadContext())
            {
                try
                {
                    List<JobModel> wholeJobs = new List<JobModel>();
                    // Veritabanı sorguları

                    var productionlines = await context.ProductionLines.ToListAsync();
                    var submachines = await context.SubMachines.ToListAsync();
                    var productionOrders = await context.ProductionOrders.ToListAsync();
                    DateTime firsttime = DateTime.Now;//işlem ne zamandan başlıyacaksa  

                    foreach (var productionOrder in productionOrders)
                    {
                        // İlgili ürün öğesini al
                        var item = await context.Items.Where(c => c.ID == productionOrder.ItemID).FirstOrDefaultAsync();
                        if (item == null) throw new Exception($"Item not found for ProductionOrder ID: {productionOrder.ID}");

                       
                        var processes = await context.ItemProcesses.Where(c => c.IGID == item.IGID).ToListAsync();
                        var operations = processes.GroupBy(c => c.QueueNumber).Select(g => new { QueueNumber = g.Key, Items = g.ToList() }).OrderBy(g => g.QueueNumber).ToList();


                        DateTime startDate = firsttime;

                        var operarionlist = new List<OperationModel>();

                        foreach (var operation in operations)
                        {
                          
                            
                            var filteredSubMachines = await new Helper().Findfilteredsubmachines(context, item, (int)operation.QueueNumber);
                            List<int> MachineOptions= new List<int>();
                            Dictionary<int, double> MachineDurations = new Dictionary<int, double>();
                           
                            foreach (var subMachine in filteredSubMachines)
                            {
                                DateTime endDate = startDate;
                               // Makinenin en son bitiş zamanını al
                               var latestSchedule = await context.MachineSchedules.Where(sch => sch.MachineId == subMachine.ID).OrderByDescending(sch => sch.EndDate).FirstOrDefaultAsync();
                                
                                // Eğer makine bir iş yapıyorsa, başlangıç zamanını güncelle
                                if (latestSchedule != null && latestSchedule.EndDate > startDate) endDate = (DateTime)latestSchedule.EndDate;
                                
                                // Bekleme süresini hesapla
                                decimal? waitingTime = await new Helper().calculateWaitingtime(context, (int)operation.QueueNumber, subMachine, productionOrder);
                                double totalTaskTime = Convert.ToDouble(waitingTime) / 3600;
                                // Saat cinsine çevir
                                endDate=endDate.AddHours(totalTaskTime);
                                double duration = (endDate - startDate).TotalMinutes;
                               
                                
                                MachineOptions.Add(subMachine.ID);
                                MachineDurations.Add(subMachine.ID, duration);
                            }

                            // Makine listesine ekle
                            operarionlist.Add(new OperationModel()
                            {
                                OperationNumber = (int)operation.QueueNumber,
                                MachineOptions= MachineOptions,
                                MachineDurations= MachineDurations,
                            });
                        }

                        // İşi tüm işlere ekle
                        wholeJobs.Add(new JobModel()
                        {
                            JobId = productionOrder.ID,
                            Operationlist = operarionlist,
                        });
                    }
                    return wholeJobs;
                }
                catch (Exception ex)
                {
                    // Hata loglama veya yönetimi
                    Console.WriteLine($"Error: {ex.Message}");
                    throw; // Hata yeniden fırlatılabilir
                }
            }


        }

    }
}
