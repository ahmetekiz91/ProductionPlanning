using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DBHelper
{


    [Table("SubMachines")]
    public class SubMachines
    {
        [Key]
        public int ID { get; set; }

        public DateTime? CDate { get; set; }

        [Column("Name_")]
        [MaxLength(50)]
        public string? Name { get; set; }

        [MaxLength(50)]
        public string? Code { get; set; }

        [MaxLength(500)]
        public string? GroupName { get; set; }

        public int? PoductionLineID { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ProcessTime { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? WaitingTime { get; set; }

        public int? QueueNumber { get; set; }

        public int? CUSRID { get; set; }

        public int? UUSRID { get; set; }

        public DateTime? UDate { get; set; }
    }

}
