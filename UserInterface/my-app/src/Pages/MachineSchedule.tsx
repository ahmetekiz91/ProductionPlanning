import React from 'react';
import GanttChart from '../components/GanttChart'; // Path to your component

const App: React.FC = () => {
  const taskData = [
    {
      taskId: '1',
      taskName: 'Task 1',
      startDate: '2024-12-01',
      endDate: '2024-12-05',
      percentComplete: 100,
    },
    {
      taskId: '2',
      taskName: 'Task 2',
      startDate: '2024-12-06',
      endDate: '2024-12-10',
      percentComplete: 80,
      dependencies: '1',
    },
    {
      taskId: '3',
      taskName: 'Task 3',
      startDate: '2024-12-11',
      endDate: '2024-12-15',
      percentComplete: 60,
      dependencies: '2',
    },
    {
      taskId: '4',
      taskName: 'Task 4',
      startDate: '2024-12-16',
      endDate: '2024-12-20',
      percentComplete: 40,
      dependencies: '3',
    },
  ];

  return (
    <div>
      <GanttChart />
    </div>
  );
};

export default App;
