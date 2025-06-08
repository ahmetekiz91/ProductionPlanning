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

    [Table("SalesPrediction")]
    public class SalesPrediction
    {
        [Key]
        public int ID { get; set; }

        public DateTime? CDate { get; set; }

        [MaxLength(50)]
        public string? Month { get; set; }

        [Column(TypeName = "decimal(18,10)")]
        public decimal? ActualSales { get; set; }

        [Column(TypeName = "decimal(18,10)")]
        public decimal? PredictedSales { get; set; }

        [MaxLength(50)]
        public string? Algorithm { get; set; }
    }

}
