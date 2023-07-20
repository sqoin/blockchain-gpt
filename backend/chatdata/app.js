const express = require('express');
const fs = require('fs');
const cors = require("cors");
const app = express();

app.use(express.json());

function sendTelegramMessage(chatId, message) {
  const botToken = '6357082334:AAGmKJY-OlGXbEjdfpmRWSp935ogpHCQW5g'; // Replace 'YOUR_BOT_TOKEN' with your actual bot token

  // API endpoint to send a message using the bot
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  // Payload to send the message
  const payload = {
    chat_id: chatId,
    text: message,
  };

  // Make a POST request to the Telegram Bot API
  axios.post(apiUrl, payload)
    .then((response) => {
      console.log('Message sent to Telegram:', response.data);
    })
    .catch((error) => {
      console.error('Error sending message to Telegram:', error);
    });
}


// Endpoint to receive and store the chat ID
app.post('/api/telegram/chat', (req, res) => {
  const { chatId } = req.body;

  console.log('Received chat ID:', chatId);

  // Store the chat ID in a file
  fs.appendFile('chatIds.json', chatId + '\n', (err) => {
    if (err) {
      console.error('Error storing chat ID:', err);
      res.status(500).json({ message: 'Failed to store chat ID' });
    } else {
      console.log('Chat ID stored:', chatId);
      res.status(200).json({ message: 'Chat ID stored successfully' });
    }
  });
});





const port = 3005; // Specify the port number you want to listen on
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
