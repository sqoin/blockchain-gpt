import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import axios from 'axios';
import { STATISTICS_BAR_CHART_URL } from '../../utils/constants';

interface ChartDataEntry {
  name: string;
  count: number;
  date: string;
}

const RadarChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataEntry[]>([]);

  useEffect(() => {
    // Fetch the JSON data from the URL using axios
    const fetchData = async () => {
      try {
        const response = await axios.get<ChartDataEntry[]>(STATISTICS_BAR_CHART_URL);
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  // Data for the radar chart
  const chartLabels = chartData.map((entry) => entry.date);
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
        data: freeAccountCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Paid Accounts',
        data: paidAccountCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      ticks: {
        beginAtZero: true,
        stepSize: 20,
        max: 100,
      },
    },
  };

  return (
    <div className='radar-chart'>
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
