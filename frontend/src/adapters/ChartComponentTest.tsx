// ChartComponent.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import 'chartjs-plugin-annotation';
import { ChartDataset } from 'chart.js/auto';


// Register the scales and elements
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

interface ChartComponentProps {
    coinName: string;
  }
  
  interface ChartData {
    labels: string[];
    datasets: ChartDataset<"line", number[]>[];
 
  }

  
  const ChartComponentTest:React.FC = () => {

    const [vsCurrency, setVsCurrency] = useState<string>("");
    const [coinName, setCoinName] = useState<string>("");
    const [days, setDays] = useState<number>();
    const [interval, setInterval] = useState<string>("daily");
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: []
      });

      const handleCheckboxChange = (index: number) => {
        setChartData((prevState) => {
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
        });
      };
      
      
      const handleVsCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVsCurrency(event.target.value);
      };
    
      const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDays(parseInt(event.target.value));
      };
    
      const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInterval(event.target.value);
      };
    
  
      const fetchChartData = async () => {
        if (!vsCurrency || !days || !coinName ) {
            alert("Please enter a valid vs_currency and days and coinName ")
            
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
          const chartData: ChartData = {
            labels: data.prices.map((price: any) =>
            new Date(price[0]).toLocaleDateString()
          ),
          datasets: [
            {
              data: data.prices.map((price: any) => price[1]),
              label: `${coinName.toUpperCase()} Price`,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              fill: false,
              hidden: false, // add this line
            },
            {
              data: data.market_caps.map((market_cap: any) => market_cap[1]),
              label: `${coinName.toUpperCase()} Market Cap`,
              backgroundColor: "rgba(255, 99, 132, 0.4)",
              borderColor: "rgba(255, 99, 132, 1)",
              fill: false,
              hidden: false, // add this line
            },
            {
              data: data.total_volumes.map((total_volume: any) => total_volume[1]),
              label: `${coinName.toUpperCase()} Total Volume`,
              backgroundColor: "rgba(255, 206, 86, 0.4)",
              borderColor: "rgba(255, 206, 86, 1)",
              fill: false,
              hidden: false, // add this line
            },
          ],
          };
          setChartData(chartData);
        } catch (error) {
          console.error("Error fetching chart data:", error);
        }
      };

  
   
  
      return (
        <div>
            <div>
                <input
                type="text"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                placeholder="Enter coin name"
                />
                 <div>
                <label>vs_currency:</label>
                <input type="text" value={vsCurrency} onChange={handleVsCurrencyChange} />
                </div>
                <div>
                <label>days:</label>
                <input type="number" value={days} onChange={handleDaysChange} />
                </div>
                <div>
                <label>interval:</label>
                <input type="text" value={interval} onChange={handleIntervalChange} />
                </div>
                <button onClick={fetchChartData}>Submit</button>
                
          </div>
           
          {chartData ? (
            <div>
              <div>
                <Line
                  style={{ maxWidth: '800px' }}
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        labels: {
                          generateLabels: function (chart: any) {
                            const datasets = chart.data.datasets;
                            return datasets.map((dataset: any, i: number) => {
                              return {
                                datasetIndex: i,
                                text: dataset.label,
                                fillStyle: dataset.borderColor,
                                strokeStyle: dataset.borderColor,
                                lineWidth: 2,
                                hidden: !chart.isDatasetVisible(i),
                                index: i,
                              };
                            });
                          },
                          usePointStyle: true,
                          pointStyle: "circle",
                          boxWidth: 10,
                          boxHeight: 10,
                        },
                        onClick: (e: any, legendItem: any, legend: any) => {
                          const index = legendItem.datasetIndex;
                          const chart = legend.chart;
                          const meta = chart.getDatasetMeta(index);
      
                          meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
                          chart.update();
                        },
                      },
                      annotation: {
                        annotations: [
                          {
                            type: "line",
                            scaleID: "y",
                            value: 0,
                            borderColor: "rgb(255, 0, 0)",
                            borderWidth: 2,
                            label: {
                              enabled: true,
                              content: "Zero line",
                            },
                          } as any,
                        ],
                      },
                    },
                  }}
                />
              </div>
              <div>
              {chartData && chartData.datasets && chartData.datasets.map((dataset: any, i: number) => (
                <div key={i} style={{ display: 'inline-block', margin: '10px' }}>
                   <input type="checkbox" checked={!dataset.hidden} onChange={() => handleCheckboxChange(i)} />
                    <label style={{color: dataset.borderColor, marginLeft: '5px'}}>{dataset.label}</label>
                </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Please enter a valid coin name.</p>
          )}
          {!chartData && <p>Error fetching chart data. Please try again later.</p>}
        </div>
      );
      
      
  
};

export default ChartComponentTest;
