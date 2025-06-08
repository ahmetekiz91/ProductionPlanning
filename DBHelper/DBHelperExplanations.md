The DBHelper project is responsible for managing all database interactions, domain models, and entity mappings related to the AI-integrated ERP system. It serves as the data layer of the solution and supports modules like sales forecasting, production scheduling, inventory management, and customer classification.

AzadContext.cs
The main DbContext class for Entity Framework Core. It connects the application to the database and defines DbSet properties for each table/model in the system.

Items.cs
Represents product master data including SKU, name, batch size, etc.

MachineSchedule.cs
Core table/model for machine job allocation across time.

MachineSchedulerunninginfos.cs
Holds runtime logs of machine scheduling — includes makespan, runtime, iterations, etc.

ProductionLines.cs
Stores information about each production line, such as its name, code, and status.

ProductionOrder.cs
Represents actual production requests including item ID, amount, and machine assigned.

ProductionPlanningTable.cs
Stores scheduling plans — possibly generated from AI models like ACO, GA, CP, etc.

ScheduleInfo.cs
Tracks metadata related to the scheduling algorithm run (start time, end time, total makespan).

SubMachines.cs
Represents machines within a production line; includes processing time and queue information.

Users.cs
Maintains system user records for logging and security.