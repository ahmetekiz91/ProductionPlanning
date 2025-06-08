using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules.RL
{
    public class RLModel
    {
        public int JobId { get; set; }
        public int MachineId { get; set; }
        public int OperationNumber { get; set; }
    }
}
