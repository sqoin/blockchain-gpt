import React, { useEffect} from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    data: number[];
    labels: string[];
  }
const PieChart: React.FC<PieChartProps> = () => {
  const data = [542267375580, 212924081813, 35372889715];
  const labels = ['BTC', 'ETH', 'BNB'];

 

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: ['#f6931b', '#808a9d', '#f0b90a'], // Add more colors if needed
      },
    ],
  };

  return (
    <div style={{ position: 'relative', top: '20px', left: '50px',width:'300px',height:'100px' }}>
      <Pie data={chartData} />
    </div>
  );
  };

export default PieChart;
