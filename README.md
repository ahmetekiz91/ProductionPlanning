# AI-Enhanced ERP System – ProductionPlanning

This project is an AI-integrated ERP backend system designed to demonstrate intelligent scheduling, forecasting, classification, and optimization features across production and inventory modules. It consists of multiple submodules including machine scheduling algorithms (ACO, GA, RL, CP), customer segmentation, demand forecasting, and a full-featured Web API.

---

## 📁 Project Structure

### 🔹 MachineSchedules
Contains AI-based optimization algorithms and solvers for production planning and job shop scheduling:
- **AntColony/** – Implements Ant Colony Optimization (ACO).
- **GA/** – Implements Genetic Algorithm for job scheduling.
- **RL/** – Reinforcement Learning-based scheduling logic.
- **Optimizer/** – Hosts Constraint Programming and helper logic.
- **Model/** – Shared domain models like JobModel, AssignedJob, etc.

### 🔹 DBHelper
Database-layer logic that maps business logic to SQL models.
- Includes `ScheduleInfo.cs`, `ProductionOrder.cs`, `ProductionLines.cs`, etc.

### 🔹 WEBAPI
ASP.NET Core Web API for exposing endpoints to external systems.
- **Controllers/** – RESTful endpoints for items, users, schedules, etc.
- **Models/** – DTOs or request/response models.
- **appsettings.json** – Configuration file (DB connection, environment settings).
- **WEAPI.http** – Test HTTP calls for debugging endpoints.

---

## 🔧 Technologies Used

- .NET Core Web API
- C#
- Entity Framework Core
- SQL Server (relational database)
- AI Algorithms: ACO, GA, RL, Constraint Programming
- JSON Serialization (custom converters)

---

## 🚀 How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmetekiz91/thesisimplementation.git
