using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBHelper
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("ProductionPlanningTable")]
    public class ProductionPlanningTable
    {
        [Key]
        public int ID { get; set; }

        [MaxLength(50)]
        public string? JobID { get; set; }

        [MaxLength(50)]
        public string? Opeation { get; set; }

        [MaxLength(50)]
        public string? AvailableMachines { get; set; }

        [MaxLength(50)]
        public string? AssignedMachine { get; set; }

        public int? ProcessingTimes { get; set; }
    }

}
