import React, { useEffect, useState } from "react";
import Chart, { ChartData, ChartItem } from "chart.js/auto";

interface CoinData {
  name: string;
  market_cap: number;
}

interface PieChartProps {
  apiEndpoint: string;
}

const PieChart: React.FC<PieChartProps> = ({ apiEndpoint }: PieChartProps) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data: CoinData[] = await response.json();

        const labels = data.map((item) => item.name);
        const values = data.map((item) => item.market_cap);
        const backgroundColors = ["#ff6384", "#36a2eb", "#ffce56"];

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColors,
            },
          ],
        });
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  useEffect(() => {
    if (chartData) {
      const ctx = document.getElementById("myChart") as ChartItem;
      new Chart(ctx, {
        type: "pie",
        data: chartData,
      });
    }
  }, [chartData]);

  return ( <div style={{backgroundColor: 'white', borderRadius: '20px', padding: '10px'}}>
  <canvas id="myChart" ></canvas>
  </div>
  );
};

export default PieChart;
