using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBHelper
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("ItemProcesses")]
    public class ItemProcesses
    {
        [Key]
        public int ID { get; set; }

        public int? IGID { get; set; }

        public int? ProductionLineID { get; set; }

        public int? SubMachineID { get; set; }

        public int? QueueNumber { get; set; }

        public DateTime? CDate { get; set; }

        public int? CUsrId { get; set; }

        public int? UUsrId { get; set; }

        // UDate appears to be an int in your table, but may represent a date; clarify if this should be DateTime
        public int? UDate { get; set; }
    }

}
