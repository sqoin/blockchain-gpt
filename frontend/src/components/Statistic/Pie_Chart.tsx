import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import './Charts.css';
import axios from 'axios';
import { STATISTICS_PIE_CHART_URL } from '../../utils/constants';

interface ChartDataEntry {
  name: string;
  count: number;
}

const PieChart = () => {
  const [chartData, setChartData] = useState<ChartDataEntry[]>([]);

  useEffect(() => {
    // Fetch the JSON data from the URL using axios
    const fetchData = async () => {
      try {
        const response = await axios.get<ChartDataEntry[]>(STATISTICS_PIE_CHART_URL);
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  // Summarize data by category (freeAccounts and PaidAccounts)
  const summaryData = chartData.reduce((acc: { [key: string]: number }, entry: ChartDataEntry) => {
    const category = entry.name;
    acc[category] = (acc[category] || 0) + entry.count;
    return acc;
  }, {});

  // Extract the category names and counts for the pie chart
  const chartLabels = Object.keys(summaryData);
  const chartValues = Object.values(summaryData);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Distribution of Accounts",
        font: {
          family: "sans-serif",
          size: 20,
        },
      },
    },
  };

  return (
    <div className="pie-chart">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
