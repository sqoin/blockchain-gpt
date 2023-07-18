import React from 'react';
import axios from 'axios';
import './TelegramMessage.css' ;

const TelegramMessage = () => {
  const handleButtonClick = async () => {
    try {
      // Open the Telegram bot link in a new tab
      window.open('http://t.me/testons_bot','_blank');
      // Retrieve the chat ID from Telegram
      const chatId = await getChatIdFromTelegram();
      console.log(chatId);

      // Send the chat ID to your backend
      await axios.post('http://localhost:3005/api/telegram/chat', { chatId });
      // Perform any other desired actions
      console.log('Button clicked, chat ID collected, and sent to the backend.');
    } catch (error) {
      console.error('Error handling button click:', error);
      console.log("Error handling button click"+error.message);
    }

  };
 
const getChatIdFromTelegram = async () => {
    // Access the Telegram API or use any other method to obtain the chat ID
    // For example, you can use Telegram's Web Login Widget or similar approaches
    // Return the chat ID here
    const response = await axios.get('https://api.telegram.org/bot6357082334:AAGmKJY-OlGXbEjdfpmRWSp935ogpHCQW5g/getUpdates');
    const chatId = response.data.result[0].message.chat.id;
    
return chatId;
  };

  return (
    <div className="TelegramMessage">
      <p>
        Click the button below to connect with our Telegram bot:
        {' '}
        <button onClick={handleButtonClick}>Start</button>
      </p>
    </div>
  );
};

export default TelegramMessage;
