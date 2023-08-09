import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

interface Entry {
  date: string;
  price: number;
}


  
function DataSets() {
    const [data, setData] = useState<Entry[]>([]);

  useEffect(() => {
    async function fetchData() {
      const url = 'https://api.openai.com/v1/chat/completions';
      const apiKey = process.env.API_KEY;;

      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };

      const data = {
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "user",
            "content": "give me price evolution of any unit example, i need just an example of data set in this format:{'data':[]} no further text should be added in the answer and the answer has to be in a json format"
          }
        ]
      };

      const response = await axios.post(url, data, { headers });
      const result = response.data.choices[0].message.content;

      // Parse the result string into an object
      const parsedData = JSON.parse(result).data;

      setData(parsedData);
    }

    fetchData();
  }, []);

const chartData = {
  labels: data.map(entry => entry.date),
  datasets: [
    {
      label: 'Price Evolution',
      data: data.map(entry => ({ x: new Date(entry.date), y: entry.price })), // Format data for time scale
      fill: false,
      borderColor: 'rgba(75,192,192,1)',
    },
  ],
};



  return (
    <div style={{background: 'white'}}>
      <h3>Price Evolution Chart</h3>
      <Line data={chartData}  />
    </div>
  );
}

export default DataSets;
