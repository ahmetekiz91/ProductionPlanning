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

    [Table("Items")]
    public class Items
    {
        [Key]
        public int ID { get; set; }
       
        public int? IGID { get; set; }
        
        public DateTime? CDate { get; set; }

        [MaxLength(50)]
        public string? CompanyItemCode { get; set; }

        [Column("Name_")]
        [MaxLength(350)]
        public string? Name { get; set; }

        [MaxLength(50)]
        public string? EAN { get; set; }

        [Column(TypeName = "decimal(18,3)")]
        public decimal? UnitPerBox { get; set; }
        
        [Column(TypeName = "decimal(18,3)")]
        public decimal? Weight { get; set; }

        [Column(TypeName = "decimal(18,5)")]
        public decimal? PCSAmount { get; set; }       

        [MaxLength(1000)]
        public string? GTIP { get; set; }

        [MaxLength(1000)]
        public string? Variant { get; set; }

        [Column(TypeName = "decimal(18,5)")]
        public decimal? SalesPrice { get; set; }
    }

}
