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

    [Table("AISalesData")]
    public class AISalesData
    {
        [Key]
        public int RowID { get; set; }

        [MaxLength(100)]
        public string? OrderID { get; set; }

        public DateTime? OrderDate { get; set; }

        public DateTime? ShipDate { get; set; }

        [MaxLength(100)]
        public string? ShipMode { get; set; }

        [MaxLength(100)]
        public string? CustomerID { get; set; }

        [MaxLength(100)]
        public string? CustomerName { get; set; }

        [MaxLength(50)]
        public string? Segment { get; set; }

        [MaxLength(50)]
        public string? Country { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? State { get; set; }

        [MaxLength(100)]
        public string? PostalCode { get; set; }

        [MaxLength(100)]
        public string? Region { get; set; }

        [MaxLength(100)]
        public string? ProductID { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        [MaxLength(100)]
        public string? SubCategory { get; set; }

        [MaxLength(255)]
        public string? ProductName { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Sales { get; set; }
    }

}
