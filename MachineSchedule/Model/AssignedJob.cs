using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MachineSchedules
{
    public class AssignedJob : IComparable
    {
        public int JobId { get; set; }

        public int TaskId { get; set; }

        public int Start { get; set; }

        public int End { get; set; }

        public int Duration { get; set; }

        public DateTime startdate { get; set; }

        public DateTime enddate { get; set; }

        public AssignedJob(int JobId, int TaskId, int Start, int Duration)
        {
            this.JobId = JobId;
            this.TaskId = TaskId;
            this.Start = Start;
            this.Duration = Duration;


        }
        public int CompareTo(object obj)
        {
            if (obj == null)
                return 1;

            AssignedJob otherTask = obj as AssignedJob;
            if (otherTask != null)
            {
                if (this.Start != otherTask.Start)
                    return this.Start.CompareTo(otherTask.Start);
                else
                    return this.Duration.CompareTo(otherTask.Duration);
            }
            else
                throw new ArgumentException("Object is not a Temperature");
        }

        public AssignedJob() { }


    }
}
