using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using DBHelper;
using Google.OrTools.Sat;
using MachineSchedules.AntColony;
using MachineSchedules.GA;
using MachineSchedules.Optimizer;
using MachineSchedules.RL;
using Microsoft.EntityFrameworkCore;

namespace MachineSchedules
{
    public class Program
    {
        [DllImport("kernel32.dll")]
        private static extern IntPtr GetCurrentProcess();

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessAffinityMask(IntPtr hProcess, IntPtr dwProcessAffinityMask);

        static void Main(string[] args)
        {
            Process.GetCurrentProcess().ProcessorAffinity = (IntPtr)0x0003;
            for (int i = 0; i < 40; i++)
            {
                //1.Ant Colony Optimization Algorithm
                //new ACOExecuter(DateTime.Now).Run().GetAwaiter().GetResult();
                //2.Genetic Algorithm
                //new GAExecuter().ExecuteGA();
                //3.Reinforcement Learning
                new RLExecuter().RLExecute();
                //4.Constraint Programming
                //new CPExecuter().Executer().GetAwaiter().GetResult();
            }


        }


    }

}
