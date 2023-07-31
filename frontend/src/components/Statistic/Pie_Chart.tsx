import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = () => {
  const chartData = [
    {"name": "freeAccounts", "count": 2, "date": "20220731000000"},
    {"name": "PaidAccounts", "count": 3, "date": "20220731000000"},
    {"name": "freeAccounts", "count": 3, "date": "20220831000000"},
    {"name": "PaidAccounts", "count": 7, "date": "20220831000000"},
    {"name": "freeAccounts", "count": 4, "date": "20220930000000"},
    {"name": "PaidAccounts", "count": 10, "date": "20220930000000"},
    {"name": "freeAccounts", "count": 6, "date": "20221031000000"},
    {"name": "PaidAccounts", "count": 11, "date": "20221031000000"},
    {"name": "freeAccounts", "count": 7, "date": "20221130000000"},
    {"name": "PaidAccounts", "count": 14, "date": "20221130000000"},
    {"name": "freeAccounts", "count": 9, "date": "20221231000000"},
    {"name": "PaidAccounts", "count": 17, "date": "20221231000000"},
    {"name": "freeAccounts", "count": 10, "date": "20230131000000"},
    {"name": "PaidAccounts", "count": 19, "date": "20230131000000"},
    {"name": "freeAccounts", "count": 11, "date": "20230228000000"},
    {"name": "PaidAccounts", "count": 21, "date": "20230228000000"},
    {"name": "freeAccounts", "count": 11, "date": "20230331000000"},
    {"name": "PaidAccounts", "count": 23, "date": "20230331000000"},
    {"name": "freeAccounts", "count": 12, "date": "20230430000000"},
    {"name": "PaidAccounts", "count": 25, "date": "20230430000000"},
    {"name": "freeAccounts", "count": 13, "date": "20230531000000"},
    {"name": "PaidAccounts", "count": 26, "date": "20230531000000"},
    {"name": "freeAccounts", "count": 14, "date": "20230630000000"},
    {"name": "PaidAccounts", "count": 28, "date": "20230630000000"},
    ];

  // Summarize data by category (freeAccounts and PaidAccounts)
  interface ChartDataEntry {
    name: string;
    count: number;
  }
  
  const summaryData: { [key: string]: number } = chartData.reduce((acc: { [key: string]: number }, entry: ChartDataEntry) => {
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
    <div className="chart">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
