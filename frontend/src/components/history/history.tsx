import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { ACCOUNT_MANAGEMENT } from '../../utils/constants';
import './history.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faSearch,faPen ,faTable } from '@fortawesome/free-solid-svg-icons';


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
          date: new Date(item.date).toLocaleDateString('fr-FR', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        })));
      })
      .catch((error:any) => {
        console.error('Error fetching input history:', error);
      });
  }, []);
  const handleSearchChange = (event:any) => {
    setSearchTerm(event.target.value);
  };

  
  const countRows = () => {
    return inputHistory.length;
  };
 
return (
<div className='history-container'>

    <div className="horizontal-container ">
    <div className="search-bar" >
    <FontAwesomeIcon icon={faSearch} className="custom-icon" />
    <input type="text" className="search-input" placeholder="Rechercher..." value={searchTerm}
            onChange={handleSearchChange} />  
    </div>
    <div className="right-section">
    <p style={{ fontSize: '20px' }}><FontAwesomeIcon icon={faTable}/> {countRows()}</p>
    </div>
    </div> 
    <div className="box-container">
      {inputHistory.map((item:any, index:any) => (
     <div className="box" key={index}>
   
       
      <p><FontAwesomeIcon icon={faPen }className="custom-icon1" />{item.input}</p>
      <p><FontAwesomeIcon icon={faCalendarAlt} className="custom-icon1"  /> {item.date}</p>

       
     </div>
    ))}
    </div>
</div>

);

};

export default History;
