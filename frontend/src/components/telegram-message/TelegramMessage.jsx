import React from 'react';

import axios from 'axios';
import './TelegramMessage.css' ;


const TelegramMessage = () => {
  

  const toMessage = async() => {
    try {
      // Call the backend API to send hello messages to all chats
      await axios.post('http://localhost:3006/sendHelloToAll');
      console.log('Hello messages sent to all chats.');
    } catch (error) {
      console.error('Error sending hello messages:', error);
    }




  }

  const handleButtonClick = async () => {
    try {
      // Open the Telegram bot link in a new tab
      window.open('http://t.me/testt159_bot','_blank');
      // Retrieve the chat ID from Telegram
      const chatId = await getChatIdFromTelegram();

      console.log(chatId);

      // Send the chat ID to your backend
      await axios.post('http://localhost:3006/api/telegram/chat', { chatId });
      // Perform any other desired actions
      
      console.log('Button clicked, chat ID collected, and sent to the backend.');
    } catch (error) {
      console.error('Error handling button click:', error);
      console.log("Error handling button click"+error.message);
    }

  };
  
 
const getChatIdFromTelegram = async () => {
  try {
    const response = await axios.get('https://api.telegram.org/bot6692494514:AAEuxi9FiEsIP4OK50nI9s4UwzX31a5OkNQ/getUpdates');
    const chatId = response.data.result[0].message.chat.id;
    return chatId;
  } catch (error) {
    console.error('Error fetching chat ID from Telegram:', error);
    return null;
  }
};

  return (
    <div className="TelegramMessage">
      <p>
        Click the button below to connect with our Telegram bot:
        {' '}
        
        <button className='start'  onClick={handleButtonClick}> Start </button>
        <button className='start'  onClick={toMessage}> send message </button>
      
      





      </p>
    </div>
  );
};

export default TelegramMessage;
