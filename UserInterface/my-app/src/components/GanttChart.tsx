import React, { useEffect, useState } from 'react';
import { parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

type ApiData = {
  MachineId: number;
  StartDate: string;
  EndDate: string;
  ItemID: number;
  POID: number;
  Duration: number;
  ID: number;
  Algorithm: string; // <-- make sure your backend includes this
};

const GanttChart: React.FC = () => {
  const [chartData, setChartData] = useState<ApiData[]>([]);
  const [filteredData, setFilteredData] = useState<ApiData[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [algorithmFilter, setAlgorithmFilter] = useState<string>(''); // <-- New state

  useEffect(() => {
    const loadGoogleCharts = async () => {
      try {
        const response = await fetch('https://localhost:7112/api/MachineSchedule/gantt-data');
        const data: ApiData[] = await response.json();
        setChartData(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadGoogleCharts();
  }, []);

  useEffect(() => {
    let filtered = chartData;

    if (algorithmFilter) {
      filtered = filtered.filter((item) => item.Algorithm === algorithmFilter);
    }

    if (filter) {
      filtered = filtered.filter(
        (item) =>
          `Machine-${item.MachineId}`.includes(filter) ||
          `PO ${item.POID}`.includes(filter) ||
          `Item-${item.ItemID}`.includes(filter)
      );
    }

    setFilteredData(filtered);
  }, [filter, algorithmFilter, chartData]);

  const drawChart = (chartData: ApiData[]) => {
    const google = (window as any).google;
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Task ID');
    dataTable.addColumn('string', 'Task Name');
    dataTable.addColumn('string', 'Resource');
    dataTable.addColumn('date', 'Start');
    dataTable.addColumn('date', 'End');
    dataTable.addColumn('number', 'Duration');
    dataTable.addColumn('number', 'Percent Complete');
    dataTable.addColumn('string', 'Dependencies');

    const rows = chartData
      .map((item) => {
        try {
          const timeZone = 'Europe/Berlin';
          const startDate = toZonedTime(parseISO(item.StartDate), timeZone);
          const endDate = toZonedTime(parseISO(item.EndDate), timeZone);

          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error(`Invalid date for task ${item.ID}`);
          }

          return [
            `PO ${item.ID}`,
            `Item-${item.ID} - PO ${item.POID} - Machine-${item.MachineId}`,
            `Machine-${item.MachineId}`,
            startDate,
            endDate,
            item.Duration,
            0,
            null,
          ];
        } catch (error) {
          console.error(error);
          return null;
        }
      })
      .filter(Boolean);

    dataTable.addRows(rows);

    const options = {
      height: Math.max(100 + rows.length * 30, 500),
      gantt: {
        trackHeight: 30,
      },
    };

    const chart = new google.visualization.Gantt(document.getElementById('chart_div'));
    chart.draw(dataTable, options);
  };

  useEffect(() => {
    if (filteredData.length > 0) {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.async = true;
      script.onload = () => {
        (window as any).google.charts.load('current', { packages: ['gantt'] });
        (window as any).google.charts.setOnLoadCallback(() => drawChart(filteredData));
      };
      document.body.appendChild(script);
    }
  }, [filteredData]);

  return (
    <div className='container'>
      <h3>Production Gantt Chart</h3>
      <div className='row'>
        <div className='col-sm-4'>
          <select
            className='form-control'
            value={algorithmFilter}
            onChange={(e) => setAlgorithmFilter(e.target.value)}
          >
            <option value="">All Algorithms</option>
            <option value="GA">Genetic Algorithm</option>
            <option value="ACO">Ant Colony Algorithm</option>
            <option value="RL">Reinforcement Learning</option>
            <option value="CP">Constraint Programming</option>
          </select>
        </div>
        <div className='col-sm-8'>
          <input
            type="text"
            placeholder="Filter by Machine, PO, or Item"
            className='form-control'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div id="chart_div" style={{ width: '100%', height: '700px' }}></div>
    </div>
  );
};

export default GanttChart;
