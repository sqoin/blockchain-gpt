import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import './Bar_Chart.css';
import axios from 'axios';
import { STATISTICS_BAR_CHART_URL } from '../../utils/constants';

interface ChartDataEntry {
  name: string;
  count: number;
  date: string;
}

const BarChart = () => {
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

  // Data for the bar chart
  const chartLabels = chartData.map((entry) => entry.date);
  const freeAccountCounts = chartData.map((entry) => (entry.name === 'freeAccounts' ? entry.count : 0));
  const paidAccountCounts = chartData.map((entry) => (entry.name === 'PaidAccounts' ? entry.count : 0));

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Free Accounts',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: freeAccountCounts,
      },
      {
        label: 'Paid Accounts',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
        text: 'Evolution of Account Counts Over Time',
        font: {
          family: 'sans-serif',
          size: 20,
        },
      },
    },
  };

  return (
    <div className="chart">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
