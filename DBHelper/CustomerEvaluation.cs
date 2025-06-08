using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DBHelper
{
    [Table("CustomerEvaluation")]
    public class CustomerEvaluation
    {
        [Key]
        public int ID { get; set; }

        public int? CustomerID { get; set; }

        public int? PCID { get; set; }

        public int? ProductID { get; set; }

        public int? PurchaseHistory { get; set; }

        public int? AverageRating { get; set; }

        public int? SentimentScore { get; set; }

        public int? SupportTickets { get; set; }

        public int? ResolutionTime { get; set; }

        public int? ReturnsCount { get; set; }

        public int? LoyaltyStatus { get; set; }

        public int? ChurnRisk { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? CustomerIncome { get; set; }
    }

}
