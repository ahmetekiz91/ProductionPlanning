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

    [Table("ProductionLines")]
    public class ProductionLines
    {
        [Key]
        public int ID { get; set; }

        public DateTime? CDate { get; set; }

        [MaxLength(50)]
        public string? Code { get; set; }

        [MaxLength(50)]
        public string? Notes { get; set; }

        [Column("Name_")]
        [MaxLength(50)]
        public string? Name { get; set; }

        public int? CUSRID { get; set; }

        public int? IsActive { get; set; }

        public int? UUSRID { get; set; }

        public DateTime? UDate { get; set; }

        public int? IGID { get; set; }
    }

}
