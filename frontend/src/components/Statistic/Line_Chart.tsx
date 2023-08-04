import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios'
import { STATISTICS_BAR_CHART_URL } from '../../utils/constants';

interface ChartDataEntry {
  name: string;
  count: number;
  date: string;
}


const LineChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataEntry[]>([]);
  useEffect(() => {
    // Fetch the JSON data from the URL using axios
    const fetchData = async () => {
      try {
        const response = await axios.get<ChartDataEntry[]>(STATISTICS_BAR_CHART_URL);
        console.log(process.env.BAR_CHART_URL?.toString);
        
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);
  // Data for the line chart
  const chartLabels = chartData.map(entry => entry.date);
  const freeAccountCounts = chartData
  .filter((entry) => entry.name === 'freeAccounts')
  .map((entry) => entry.count);


  const paidAccountCounts = chartData
    .filter((entry) => entry.name === 'PaidAccounts')
    .map((entry) => entry.count);



  

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Free Accounts',
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: freeAccountCounts,
      },
      {
        label: 'Paid Accounts',
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: paidAccountCounts,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Evolution of Account Counts Over Time",
        font: {
          family: "sans-serif",
          size: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className='line-chart'>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
