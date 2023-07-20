import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

interface DataPoint {
  timestamp: number;
  price: number;
}

function CryptoChart() {
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
        const bitcoinPrices = bitcoinData.prices.map((dataPoint: number[]) => ({
          timestamp: dataPoint[0],
          price: dataPoint[1],
        }));
        setBitcoinData(bitcoinPrices);

        const ethereumResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30'
        );
        const ethereumData = await ethereumResponse.json();
        const ethereumPrices = ethereumData.prices.map((dataPoint: number[]) => ({
          timestamp: dataPoint[0],
          price: dataPoint[1],
        }));
        setEthereumData(ethereumPrices);

        const bnbResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/binancecoin/market_chart?vs_currency=usd&days=30'
        );
        const bnbData = await bnbResponse.json();
        const bnbPrices = bnbData.prices.map((dataPoint: number[]) => ({
          timestamp: dataPoint[0],
          price: dataPoint[1],
        }));
        setBnbData(bnbPrices);

        const solResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=30'
        );
        const solData = await solResponse.json();
        const solPrices = solData.prices.map((dataPoint: number[]) => ({
          timestamp: dataPoint[0],
          price: dataPoint[1],
        }));
        setSolData(solPrices);

        const dotResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/polkadot/market_chart?vs_currency=usd&days=30'
        );
        const dotData = await dotResponse.json();
        const dotPrices = dotData.prices.map((dataPoint: number[]) => ({
          timestamp: dataPoint[0],
          price: dataPoint[1],
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
      const bitcoinMaxPriceDataPoint = bitcoinData.reduce(
        (max: DataPoint, dataPoint: DataPoint) => (dataPoint.price > max.price ? dataPoint : max),
        bitcoinData[0]
      );
      setMaxBitcoinPrice(bitcoinMaxPriceDataPoint.price);
      const bitcoinMaxPriceDate = new Date(bitcoinMaxPriceDataPoint.timestamp).toLocaleDateString();
      setMaxBitcoinPriceDate(bitcoinMaxPriceDate);

      const ethereumMaxPriceDataPoint = ethereumData.reduce(
        (max: DataPoint, dataPoint: DataPoint) => (dataPoint.price > max.price ? dataPoint : max),
        ethereumData[0]
      );
      setMaxEthereumPrice(ethereumMaxPriceDataPoint.price);
      const ethereumMaxPriceDate = new Date(ethereumMaxPriceDataPoint.timestamp).toLocaleDateString();
      setMaxEthereumPriceDate(ethereumMaxPriceDate);

      const bnbMaxPriceDataPoint = bnbData.reduce(
        (max: DataPoint, dataPoint: DataPoint) => (dataPoint.price > max.price ? dataPoint : max),
        bnbData[0]
      );
      setMaxBnbPrice(bnbMaxPriceDataPoint.price);
      const bnbMaxPriceDate = new Date(bnbMaxPriceDataPoint.timestamp).toLocaleDateString();
      setMaxBnbPriceDate(bnbMaxPriceDate);

      const solMaxPriceDataPoint = solData.reduce(
        (max: DataPoint, dataPoint: DataPoint) => (dataPoint.price > max.price ? dataPoint : max),
        solData[0]
      );
      setMaxSolPrice(solMaxPriceDataPoint.price);
      const solMaxPriceDate = new Date(solMaxPriceDataPoint.timestamp).toLocaleDateString();
      setMaxSolPriceDate(solMaxPriceDate);

      const dotMaxPriceDataPoint = dotData.reduce(
        (max: DataPoint, dataPoint: DataPoint) => (dataPoint.price > max.price ? dataPoint : max),
        dotData[0]
      );
      setMaxDotPrice(dotMaxPriceDataPoint.price);
      const dotMaxPriceDate = new Date(dotMaxPriceDataPoint.timestamp).toLocaleDateString();
      setMaxDotPriceDate(dotMaxPriceDate);
    }
  }, [bitcoinData, ethereumData, bnbData, solData, dotData]);

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
            label: 'Bitcoin Price (USD)',
            data: bitcoinData.map((dataPoint) => dataPoint.price),
            borderColor: 'blue',
            fill: false,
          },
          {
            label: 'Ethereum Price (USD)',
            data: ethereumData.map((dataPoint) => dataPoint.price),
            borderColor: 'green',
            fill: false,
          },
          {
            label: 'BNB Price (USD)',
            data: bnbData.map((dataPoint) => dataPoint.price),
            borderColor: 'purple',
            fill: false,
          },
          {
            label: 'Solana Price (USD)',
            data: solData.map((dataPoint) => dataPoint.price),
            borderColor: 'orange',
            fill: false,
          },
          {
            label: 'Polkadot Price (USD)',
            data: dotData.map((dataPoint) => dataPoint.price),
            borderColor: 'red',
            fill: false,
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

export default CryptoChart;
