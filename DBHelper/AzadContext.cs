namespace DBHelper
{
    using System;
    using System.Collections.Generic;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using System.Reflection.Emit;
    using static System.Formats.Asn1.AsnWriter;
    using System.Data;
    using System.Diagnostics.Metrics;

    public partial class AzadContext : DbContext
    {
        private readonly IConfiguration _configuration;
        public AzadContext()
        {
        }

        public AzadContext(DbContextOptions<AzadContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;

        }

        public virtual DbSet<ItemProcesses> ItemProcesses { get; set; }
        public virtual DbSet<MachineSchedulerunninginfos> MachineSchedulerunninginfos { get; set; }
        public virtual DbSet<ScheduleInfo> ScheduleInfos { get; set; }
        public virtual DbSet<MachineSchedule> MachineSchedules { get; set; }
        public virtual DbSet<AISalesData> AISalesDatas { get; set; }
        public virtual DbSet<CustomerEvaluation> CustomerEvaluations { get; set; }
        public virtual DbSet<CustomerSegmentationTable> CustomerSegmentationTables { get; set; }
        public virtual DbSet<InventoryManagement> InventoryManagements { get; set; }
        public virtual DbSet<Items> Items { get; set; }
        public virtual DbSet<ProductBasedEstimation> ProductBasedEstimations { get; set; }
        public virtual DbSet<ProductionOrder> ProductionOrders { get; set; }
        public virtual DbSet<ProductionPlanningTable> ProductionPlanningTables { get; set; }
        public virtual DbSet<SalesPrediction> SalesPredictions { get; set; }
        public virtual DbSet<SubMachines> SubMachines { get; set; }
        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<ProductionLines> ProductionLines { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
            //optionsBuilder.UseSqlServer(ConfigurationExtensions.GetConnectionString(_configuration, "DefaultConnection"));
        optionsBuilder.UseSqlServer("Server=DESKTOP-776APT6\\AHMET;Database=AZAD;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True");
        //optionsBuilder.UseSqlServer("Server=DESKTOP-2LTGOU9\\SQLEXPRESS;Database=AZAD;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True");
        //DESKTOP-2LTGOU9\\SQLEXPRESS
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProductionLines>(entity =>
            {
                entity.ToTable("ProductionLines");
                entity.HasKey(e => e.ID);
            });
            modelBuilder.Entity<AISalesData>(entity =>
            {
                entity.ToTable("AISalesData");
                entity.HasKey(e => e.RowID);
                entity.Property(e => e.Sales).HasColumnType("decimal(10,2)");
                entity.Property(e => e.ProductName).HasMaxLength(255);
            });
            // CustomerEvaluation
            modelBuilder.Entity<CustomerEvaluation>(entity =>
            {
                entity.ToTable("CustomerEvaluation");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.CustomerIncome).HasColumnType("decimal(18,4)");
            });

            // CustomerSegmentationTable
            modelBuilder.Entity<CustomerSegmentationTable>(entity =>
            {
                entity.ToTable("CustomerSegmentationTable");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.Monetary).HasColumnType("decimal(18,2)");
                entity.Property(e => e.CustomerID).HasMaxLength(50);
                entity.Property(e => e.Segment).HasMaxLength(50);
            });

            // InventoryManagement
            modelBuilder.Entity<InventoryManagement>(entity =>
            {
                entity.ToTable("InventoryManagement");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.CurrentStock).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Sales).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Forecast).HasColumnType("decimal(18,2)");
            });

            // ItemProcesses
            modelBuilder.Entity<ItemProcesses>(entity =>
            {
                entity.ToTable("ItemProcesses");
                entity.HasKey(e => e.ID);
            });

            // Items
            modelBuilder.Entity<Items>(entity =>
            {
                entity.ToTable("Items");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.UnitPerBox).HasColumnType("decimal(18,3)");
                entity.Property(e => e.SalesPrice).HasColumnType("decimal(18,5)");
                entity.Property(e => e.Name).HasColumnName("Name_");
            });
            modelBuilder.Entity<ScheduleInfo>(entity =>
            {
                entity.ToTable("ScheduleInfo");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.TotalMakespan).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ExecutionDuration).HasColumnType("decimal(18,2)");
            });
            // MachineSchedule
            modelBuilder.Entity<MachineSchedule>(entity =>
            {
                entity.ToTable("MachineSchedule");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.WaitingTime).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            });

            


            modelBuilder.Entity<MachineSchedulerunninginfos>(entity =>
            {
                entity.ToTable("MachineSchedulerunninginfos");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.WaitingTime).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            });
            
            // ProductBasedEstimation
            modelBuilder.Entity<ProductBasedEstimation>(entity =>
            {
                entity.ToTable("ProductBasedEstimation");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.PredictedSales).HasColumnType("decimal(18,10)");
            });

            // ProductionOrder
            modelBuilder.Entity<ProductionOrder>(entity =>
            {
                entity.ToTable("ProductionOrder");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,4)");
            });

            // ProductionPlanningTable
            modelBuilder.Entity<ProductionPlanningTable>(entity =>
            {
                entity.ToTable("ProductionPlanningTable");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.JobID).HasMaxLength(50);
            });

            // SalesPrediction
            modelBuilder.Entity<SalesPrediction>(entity =>
            {
                entity.ToTable("SalesPrediction");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.ActualSales).HasColumnType("decimal(18,10)");
                entity.Property(e => e.PredictedSales).HasColumnType("decimal(18,10)");
            });

            // SubMachines
            modelBuilder.Entity<SubMachines>(entity =>
            {
                entity.ToTable("SubMachines");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.Name).HasColumnName("Name_").HasMaxLength(50);
                entity.Property(e => e.ProcessTime).HasColumnType("decimal(18,2)");
                entity.Property(e => e.WaitingTime).HasColumnType("decimal(18,2)");
            });

            // Users
            modelBuilder.Entity<Users>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.ID);
                entity.Property(e => e.Email).HasMaxLength(50);
                entity.Property(e => e.Password).HasMaxLength(50);
            });







            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }

}
