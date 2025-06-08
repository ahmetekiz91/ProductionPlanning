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

    [Table("InventoryManagement")]
    public class InventoryManagement
    {
        [Key]
        public int ID { get; set; }

        [MaxLength(50)]
        public string? ProductID { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? CurrentStock { get; set; }

        public int? LeadTime { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Sales { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Forecast { get; set; }

        [MaxLength(50)]
        public string? RiskofBackorder { get; set; }

        [MaxLength(150)]
        public string? ProductName { get; set; }
    }

}
