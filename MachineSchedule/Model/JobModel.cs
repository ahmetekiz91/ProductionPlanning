using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MachineSchedules.Model;

namespace MachineSchedules
{
    public class OperationModel
    {
        public int OperationNumber { get; set; }
        public List<int> MachineOptions { get; set; } // List of machine IDs
        public Dictionary<int, double> MachineDurations { get; set; } // Duration per machine
    }
    public class JobModel
    {
        public List<MachineList>? machinelist { get; set; }
        public int JobId { get; set; }
        public List<OperationModel> Operationlist { get; set; }
    }
    public class SolutionModel
    {
        public int JobId { get; set; }
        public int OperationNumber { get; set; }
        public int MachineId { get; set; }
        public double StartTime { get; set; }
        public double EndTime { get; set; }
    }
}
