import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

interface DataPoint {
  timestamp: number;
  price: number;
}

function BitcoinChart (){
  const [bitcoinData, setBitcoinData] = useState<DataPoint[]>([]);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30'
        );
        const data = await response.json();
        const bitcoinPrices = data.prices.map((dataPoint: number[]) => {
          return {
            timestamp: dataPoint[0],
            price: dataPoint[1],
          };
        });

        setBitcoinData(bitcoinPrices);
      } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
      }
    };

    fetchBitcoinData();
  }, []);

  useEffect(() => {
    // Create a chart once the bitcoinData is available or changes
    if (bitcoinData.length > 0) {
      const chartData = {
        labels: bitcoinData.map((dataPoint) => {
          const date = new Date(dataPoint.timestamp);
          return date.toLocaleDateString(); // Format the timestamp as desired
        }),
        datasets: [
          {
            label: 'Bitcoin Price (USD)',
            data: bitcoinData.map((dataPoint) => dataPoint.price),
            borderColor: 'blue',
            fill: false,
            
          },
        ],
      };

      const ctx = document.getElementById('bitcoinChart') as HTMLCanvasElement;
      if (ctx) {
        // Destroy the previous chart instance if it exists
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: chartData,
        });
      }
    }
  }, [bitcoinData]);

  return (
    <div style={{ position: 'relative', top: '175px', left: '5px', backgroundColor: 'white' }}>
      <canvas id="bitcoinChart" width={300} height={100}></canvas>
    </div>
  );
  };

export default BitcoinChart;
