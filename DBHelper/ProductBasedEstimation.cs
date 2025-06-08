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

    [Table("ProductBasedEstimation")]
    public class ProductBasedEstimation
    {
        [Key]
        public int ID { get; set; }

        public DateTime? CDate { get; set; }

        public int? Month { get; set; }

        [MaxLength(50)]
        public string? ProductID { get; set; }

        [Column(TypeName = "decimal(18,10)")]
        public decimal? PredictedSales { get; set; }
    }

}
