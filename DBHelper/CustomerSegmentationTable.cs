using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DBHelper
{
    [Table("CustomerSegmentationTable")]
    public class CustomerSegmentationTable
    {
        [Key]
        public int ID { get; set; }

        [MaxLength(50)]
        public string? CustomerID { get; set; }

        public int? Recency { get; set; }

        public int? Frequency { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Monetary { get; set; }

        [MaxLength(50)]
        public string? Segment { get; set; }

        [MaxLength(50)]
        public string? CustomerName { get; set; }
    }

}
