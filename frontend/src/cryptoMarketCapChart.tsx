import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

interface DataPoint {
  timestamp: number;
  price: number;
  marketCap: number;
}

function CryptomarketCapChart() {
  const [bitcoinData, setBitcoinData] = useState<DataPoint[]>([]);
  const [ethereumData, setEthereumData] = useState<DataPoint[]>([]);
  const [bnbData, setBnbData] = useState<DataPoint[]>([]);
  const [solData, setSolData] = useState<DataPoint[]>([]);
  const [dotData, setDotData] = useState<DataPoint[]>([]);
  const [maxBitcoinPrice, setMaxBitcoinPrice] = useState<number | null>(null);
  const [maxBitcoinPriceDate, setMaxBitcoinPriceDate] = useState<string | null>(null);
  const [maxEthereumPrice, setMaxEthereumPrice] = useState<number | null>(null);
  const [maxEthereumPriceDate, setMaxEthereumPriceDate] = useState<string | null>(null);
  const [maxBnbPrice, setMaxBnbPrice] = useState<number | null>(null);
  const [maxBnbPriceDate, setMaxBnbPriceDate] = useState<string | null>(null);
  const [maxSolPrice, setMaxSolPrice] = useState<number | null>(null);
  const [maxSolPriceDate, setMaxSolPriceDate] = useState<string | null>(null);
  const [maxDotPrice, setMaxDotPrice] = useState<number | null>(null);
  const [maxDotPriceDate, setMaxDotPriceDate] = useState<string | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bitcoinResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30'
        );
        const bitcoinData = await bitcoinResponse.json();
        const bitcoinPrices = bitcoinData.prices.map((dataPoint: number[], index: number) => ({
          timestamp: dataPoint[0],
          price: dataPoint[1],
          marketCap: bitcoinData.market_caps[index][1],
        }));
        setBitcoinData(bitcoinPrices);

        const ethereumResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30'
        );
        const ethereumData = await ethereumResponse.json();
        const ethereumPrices = ethereumData.prices.map((dataPoint: number[], index: number) => ({
          timestamp: dataPoint[0],
          price: dataPoint[1],
          marketCap: ethereumData.market_caps[index][1],
        }));
        setEthereumData(ethereumPrices);

        const bnbResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/binancecoin/market_chart?vs_currency=usd&days=30'
        );
        const bnbData = await bnbResponse.json();
        const bnbPrices = bnbData.prices.map((dataPoint: number[], index: number) => ({
          timestamp: dataPoint[0],
          price: dataPoint[1],
          marketCap: bnbData.market_caps[index][1],
        }));
        setBnbData(bnbPrices);

        const solResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=30'
        );
        const solData = await solResponse.json();
        const solPrices = solData.prices.map((dataPoint: number[], index: number) => ({
          timestamp: dataPoint[0],
          price: dataPoint[1],
          marketCap: solData.market_caps[index][1],
        }));
        setSolData(solPrices);

        const dotResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/polkadot/market_chart?vs_currency=usd&days=30'
        );
        const dotData = await dotResponse.json();
        const dotPrices = dotData.prices.map((dataPoint: number[], index: number) => ({
          timestamp: dataPoint[0],
          price: dataPoint[1],
          marketCap: dotData.market_caps[index][1],
        }));
        setDotData(dotPrices);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

 

  useEffect(() => {
    if (
      bitcoinData.length > 0 &&
      ethereumData.length > 0 &&
      bnbData.length > 0 &&
      solData.length > 0 &&
      dotData.length > 0
    ) {
      const chartData = {
        labels: bitcoinData.map((dataPoint) => {
          const date = new Date(dataPoint.timestamp);
          return date.toLocaleDateString();
        }),
        datasets: [
          {
            label: 'Bitcoin Market Cap',
            data: bitcoinData.map((dataPoint) => dataPoint.marketCap),
            borderColor: 'blue',
            fill: false,
            yAxisID: 'marketCap',
          },
          {
            label: 'Ethereum Market Cap',
            data: ethereumData.map((dataPoint) => dataPoint.marketCap),
            borderColor: 'green',
            fill: false,
            yAxisID: 'marketCap',
          },
          {
            label: 'BNB Market Cap',
            data: bnbData.map((dataPoint) => dataPoint.marketCap),
            borderColor: 'purple',
            fill: false,
            yAxisID: 'marketCap',
          },
          {
            label: 'Solana Market Cap',
            data: solData.map((dataPoint) => dataPoint.marketCap),
            borderColor: 'orange',
            fill: false,
            yAxisID: 'marketCap',
          },
          {
            label: 'Polkadot Market Cap',
            data: dotData.map((dataPoint) => dataPoint.marketCap),
            borderColor: 'red',
            fill: false,
            yAxisID: 'marketCap',
          },
        ],
      };

      const ctx = document.getElementById('cryptoChart') as HTMLCanvasElement;
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
              marketCap: {
                position: 'left',
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [bitcoinData, ethereumData, bnbData, solData, dotData]);

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '10px' }}>
      <canvas id="cryptoChart"></canvas>
    </div>
  );
}


export default CryptomarketCapChart;


