import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { ACCOUNT_MANAGEMENT } from '../../utils/constants';
import './history.css';

const History: React.FC = () => {
  const [inputHistory, setInputHistory] = useState<{ input: string, date: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  let id='';
  const session=useSessionContext();

  if(!session.loading)
  {
    id=session.userId;
  }
  console.log(id);

  useEffect(() => {
    const userId = id; 

    axios.get(`${ACCOUNT_MANAGEMENT}/api/getInputHistory/${userId}`)
      .then((response :AxiosResponse)=> {
        const data = response.data;
        setInputHistory(data.map((item: { input: string, date: string }) => ({
          input: item.input,
          date: new Date(item.date).toLocaleString() // Formatez la date comme vous le souhaitez
        })));
      })
      .catch((error:any) => {
        console.error('Error fetching input history:', error);
      });
  }, []);
  const handleSearchChange = (event:any) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

return (
    <div className='history-container'>

        <div className="box-container">
          
        <div className="search-bar">
    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M10 18a8 8 0 1 1 8-8h-2a6 6 0 1 0-6 6v2zm-7.5-4a7.5 7.5 0 0 1 11.971-6.042l4.256 4.256a1 1 0 0 1-1.414 1.414l-4.256-4.256A7.5 7.5 0 0 1 2.5 14z"/>
    </svg>
    
    <input
          type="text"
          className="search-input"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={handleSearchChange}
        />  </div>

        {inputHistory.map((item:any, index:any) => (
        <div className="box" key={index}>
          <ul>
            <li>
              <p><strong>Input:</strong> {item.input}</p>
              <p><strong>Date:</strong> {item.date}</p>
            </li>
          </ul>
        </div>
  ))}
        </div>
    </div>



   
);

};

export default History;
