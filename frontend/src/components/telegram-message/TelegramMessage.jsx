import React from 'react';
import axios from 'axios';
import './TelegramMessage.css' ;

const TelegramMessage = () => {
  const handleButtonClick = async () => {
    try {
      // Open the Telegram bot link in a new tab
      window.open('http://t.me/sqqoiin_bot','_blank');
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
    // Access the Telegram API or use any other method to obtain the chat ID
    // For example, you can use Telegram's Web Login Widget or similar approaches
    // Return the chat ID here
    const response = await axios.get('https://api.telegram.org/bot6572515145:AAH3lQky2jdYWs84nH0ZOf_-AnroOH3NGXs/getUpdates');
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
