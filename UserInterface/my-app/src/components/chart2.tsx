import React, { useEffect } from 'react';
import { parseISO } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';
// Define the type for your API data
type ApiData = {
  MachineId: number;       // Unique ID for the machine
  StartDate: string;       // Start date in ISO format
  EndDate: string;         // End date in ISO format
  ItemID: number;          // Item ID associated with the task
  POID: number;            // Production Order ID
  Duration: number; 
  Id:number;       // Task duration in days
};

const GanttChart: React.FC = () => {
  useEffect(() => {
    const loadGoogleCharts = async () => {
      try {
        // Fetch data from the API
        const response = await fetch('https://localhost:7112/api/production/machineschedule');
        const data: ApiData[] = await response.json();

        // Dynamically load the Google Charts library
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.async = true;
        script.onload = () => {
          (window as any).google.charts.load('current', { packages: ['gantt'] });
          (window as any).google.charts.setOnLoadCallback(() => drawChart(data));
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading Google Charts or fetching data:', error);
      }
    };

    // Convert days to milliseconds
    const daysToMilliseconds = (days: number): number => days * 24 * 60 * 60 * 1000;

    // Draw the Gantt chart
    const drawChart = (chartData: ApiData[]) => {
      const google = (window as any).google;
      const dataTable = new google.visualization.DataTable();

      // Define table columns
      dataTable.addColumn('string', 'Task ID');
      dataTable.addColumn('string', 'Task Name');
      dataTable.addColumn('string', 'Resource');
      dataTable.addColumn('date', 'Start');
      dataTable.addColumn('date', 'End');
      dataTable.addColumn('number', 'Duration');
      dataTable.addColumn('number', 'Percent Complete');
      dataTable.addColumn('string', 'Dependencies');

      // Map API data to chart rows
      const rows = chartData
        .map((item) => {
          try {
            const timeZone = 'Europe/Berlin';
            const startDate = toZonedTime(parseISO(item.StartDate), timeZone);
            const endDate = toZonedTime(parseISO(item.EndDate), timeZone);
            console.log(startDate)
            console.log(endDate)
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              throw new Error(`Invalid date format for task ${item.MachineId}`);
            }

            return [
              `PO ${item.Id}`, // Task ID
              `Item-${item.ItemID}`+'-'+`PO ${item.POID}`+'-'+ `Machine-${item.MachineId}`, // Task Name
              `Machine-${item.MachineId}`, // Resource
              startDate, // Start Date
              endDate, // End Date
              null, // Duration (optional, calculated automatically by Google Gantt)
              100, // Percent Complete
              null, // Dependencies
            ];
          } catch (error) {
            console.error(error);
            return null; // Skip invalid rows
          }
        })
        .filter(Boolean); // Remove null rows

      dataTable.addRows(rows);

      // Chart options
      const options = {
        height: 1500,
        gantt: {
          trackHeight: 30,
        },
      };

      // Create and render the Gantt chart
      const chart = new google.visualization.Gantt(
        document.getElementById('chart_div')
      );
      chart.draw(dataTable, options);
    };

    loadGoogleCharts();
  }, []);

  return <div id="chart_div" style={{ width: '100%', height: '700px' }}></div>;
};

export default GanttChart;
