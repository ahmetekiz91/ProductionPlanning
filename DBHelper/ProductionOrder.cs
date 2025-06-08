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

    [Table("ProductionOrder")]
    public class ProductionOrder
    {
        [Key]
        public int ID { get; set; }

        public DateTime? CDate { get; set; }

        public int? ORDID { get; set; }

        public int? CUSRID { get; set; }

        public int? ItemID { get; set; }

        public DateTime? Date { get; set; }

        public int? FicheID { get; set; }

        public int? IsConfirmed { get; set; }

        public int? MachineID { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? Amount { get; set; }

        public int? IsCompleted { get; set; }

        public int? UUSRID { get; set; }

        public DateTime? UDate { get; set; }

        public int? UnitID { get; set; }
    }

}
