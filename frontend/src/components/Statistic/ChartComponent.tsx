import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import 'chartjs-plugin-annotation';
import { ChartDataset, ChartTypeRegistry, ScatterDataPoint, BubbleDataPoint } from 'chart.js/auto';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { Line, Pie } from 'react-chartjs-2';
import PieChart from './Pie_Chart';

// Register the scales and elements
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

// Interface for ChartData
interface ChartData<TType extends keyof ChartTypeRegistry = keyof ChartTypeRegistry> {
  labels: string[];
  datasets: ChartDataset<TType, (number | ScatterDataPoint | BubbleDataPoint | null)[]>[];
}

const ChartComponent: React.FC = () => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const coinName = queryParams['coinName'] as string;
  const vsCurrency = queryParams['vsCurrency'] as string;
  const days = parseInt(queryParams['days'] as string);
  const [interval, setInterval] = useState<string>('daily');
  const [chartData, setChartData] = useState<ChartData | null>(null);

  interface ChartDataEntry {
    name: string;
    count: number;
  }
    

  const handleCheckboxChange = (index: number) => {
    setChartData((prevState) => {
      if (prevState) {
        return {
          ...prevState,
          datasets: prevState.datasets.map((dataset, i) => {
            if (i === index) {
              return {
                ...dataset,
                hidden: !dataset.hidden,
              };
            }
            return dataset;
          }),
        };
      }
      return null;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!vsCurrency || !days || !coinName) {
        alert('Please enter a valid vs_currency, days, and coinName');
        return;
      }

      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinName}/market_chart`, {
          params: {
            vs_currency: vsCurrency,
            days: days,
            interval: interval,
          },
        });

        const data = response.data;
        const chartData: ChartData<'line'> = {
          labels: data.prices.map((price: any) => new Date(price[0]).toLocaleDateString()),
          datasets: [
            {
              data: data.prices.map((price: any) => price[1]),
              label: `${coinName.toUpperCase()} Price`,
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
              fill: false,
              hidden: false,
            },
          ],
        };
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData(null);
      }
    };

    fetchData();
  }, [coinName, vsCurrency, days, interval]);

  const pieChartData = {
    labels: ['Free Accounts', 'Paid Accounts'],
    datasets: [
      {
        data: [2, 3], // Replace with your actual data points
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
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
    <div>
      <PieChart />
      {chartData && chartData.labels.length > 0 ? (
        <div>
          <div>
            <Line
               style={{ maxWidth: '800px' }}
               data={chartData as ChartData<'line'>}
               options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    labels: {
                      generateLabels: function (chart: any) {
                        const datasets = chart.data.datasets;
                        return chartData.datasets.map((dataset: any, i: number) => ({
                          datasetIndex: i,
                          text: dataset.label,
                          fillStyle: dataset.borderColor,
                          strokeStyle: dataset.borderColor,
                          lineWidth: 2,
                          hidden: !chart.isDatasetVisible(i),
                          index: i,
                        }));
                      },
                      usePointStyle: true,
                      pointStyle: 'circle',
                      boxWidth: 10,
                      boxHeight: 10,
                    },
                  },
                  annotation: {
                    annotations: [
                      {
                        type: 'line',
                        scaleID: 'y',
                        value: 0,
                        borderColor: 'rgb(255, 0, 0)',
                        borderWidth: 2,
                        label: {
                          enabled: true,
                          content: 'Zero line',
                        },
                      } as any,
                    ],
                  },
                },
              }}
               />
          </div>
          <div>
            {chartData.datasets.map((dataset: any, i: number) => (
              <div key={i} style={{ display: 'inline-block', margin: '10px' }}>
                <input type="checkbox" checked={!dataset.hidden} onChange={() => handleCheckboxChange(i)} />
                <label style={{ color: dataset.borderColor, marginLeft: '5px' }}>{dataset.label}</label>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Please enter a valid coin name.</p>
      )}

      {/* Pie Chart 
      <div className="chart">
        <Pie data={pieChartData} options={options} />
      </div>*/}

      

      {!chartData?.labels.length && <p>Error fetching chart data. Please try again later.</p>}
    </div>
  );
};

export default ChartComponent;
