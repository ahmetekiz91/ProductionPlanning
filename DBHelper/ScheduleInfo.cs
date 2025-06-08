using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBHelper
{
    [Table("ScheduleInfos")]
    public class ScheduleInfo
    {
        [Key]
        public int ID { get; set; }

        public DateTime? CDate { get; set; }

        [StringLength(50)]
        public string? Algorithm { get; set; }

        public DateTime? ScheduleStart { get; set; }

        public DateTime? ScheduleEnd { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? TotalMakespan { get; set; }

        public DateTime? ExecutionStartTime { get; set; }

        public DateTime? ExecutionEndTime { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? ExecutionDuration { get; set; }

        public int? Iterations { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? Runtimes { get; set; }
    }
}
