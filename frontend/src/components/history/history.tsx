import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { ACCOUNT_MANAGEMENT } from '../../utils/constants';
import SideBar from '../SideBar/SideBar';
import './history.css';

const History: React.FC = () => {
  const [inputHistory, setInputHistory] = useState<string[]>([]);
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
        setInputHistory(data.map((item: { input: string }) => item.input));
      })
      .catch((error:any) => {
        console.error('Error fetching input history:', error);
      });
  }, []);

return (
    <div className='history-container'>
        <div className='sidebar'>
            <SideBar remaining={20} disabled={false}/>
        </div>
        <div className='history-items'>
          <h4>Your latest inputs</h4>
            {inputHistory.map((input, index) => (
                <li key={index}>{input}</li>
            ))}
        </div>
    </div>
);

};

export default History;
