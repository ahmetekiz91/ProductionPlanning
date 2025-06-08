using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBHelper
{
    [Table("MachineSchedulerunninginfos")]
    public class MachineSchedulerunninginfos
    {
        [Key]
        public int ID { get; set; }

        public DateTime? CDate { get; set; }

        public int? CUSRID { get; set; }

        public int? MachineId { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? WaitingTime { get; set; }

        public int? UnitID { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Amount { get; set; }

        public int? ItemID { get; set; }

        public int? POID { get; set; }

        public DateTime? UDate { get; set; }

        public int? UUSRID { get; set; }

        public int? QueueNumber { get; set; }

        public string? Algorithm { get; set; }

        [NotMapped]
        public int? Duration { get; set; }
    }
}
