import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

interface DataPoint {
  timestamp: number;
  price: number;
}

function BitcoinChart() {
  const [bitcoinData, setBitcoinData] = useState<DataPoint[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [maxPriceDate, setMaxPriceDate] = useState<string | null>(null);
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

        // Calculate the maximum price and its date
        const maxPriceDataPoint = bitcoinPrices.reduce(
          (max: DataPoint, dataPoint: DataPoint) => (dataPoint.price > max.price ? dataPoint : max),
          bitcoinPrices[0]
        );
        setMaxPrice(maxPriceDataPoint.price);
        const maxPriceDate = new Date(maxPriceDataPoint.timestamp).toLocaleDateString();
        setMaxPriceDate(maxPriceDate);
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
    <div style={{backgroundColor: 'white', borderRadius: '20px', padding: '10px'}}>
      <canvas id="bitcoinChart"></canvas>
      <h2>
        Bitcoin Price (USD) - Maximum Price: {maxPrice !== null ? maxPrice.toFixed(2) : 'N/A'}
      </h2>
      <h2>Date: {maxPriceDate !== null ? maxPriceDate : 'N/A'}</h2>
    </div>
  );
  
  
}

export default BitcoinChart;
