const express = require('express');
const fs = require('fs');
const cors = require("cors");
const app = express();
const axios= require("axios")
const bodyParser = require('body-parser');
const routes = require('./routes/routes.ts');
app.use(express.json());

const ChatId = require('./model');

async function sendHelloMessageToAll() {
  try {
    // Fetch all chat IDs from the database
    const chatIds = await ChatId.find({}, 'chatId'); // Only retrieve the 'chatId' field

    console.log("start sending alerts..", chatIds);

    // Send the "hello message" to each chat ID using the custom function
    chatIds.forEach((chat) => {
      const telegramApiUrl = `https://api.telegram.org/bot5856888046:AAH4B7M6Rcei9RFvlyYlbmNWMscMjmKUuRs/sendMessage?chat_id=${chat.chatId}&text=hello`;
      axios.get(telegramApiUrl)
        .then((response) => {
          console.log('Message sent to Telegram:', response.data);
        })
        .catch((error) => {
          console.error('Error sending message to Telegram:', error);
        });
    });
  } catch (error) {
    console.error('Error fetching chat IDs:', error);
  }
}
// Endpoint to receive and store the chat ID
app.post('/api/telegram/chat', (req, res) => {
  const { chatId } = req.body;
  sendHelloMessageToAll();

  console.log('Received chat ID:', chatId);

  // Store the chat ID in a file
 
  fs.appendFile('chatIds.json', chatId + '\n', (err) => {
    if (err) {
      console.error('Error storing chat ID:', err);
      res.status(500).json({ message: 'Failed to store chat ID' });
    } else {
      console.log('Chat ID stored:', chatId);
      res.status(200).json({ message: 'Chat ID stored successfully' });
      sendHelloMessageToAll();
      console.log("message telegram recu ")

    }
  } );
});

app.use(bodyParser.json());
app.use('/api', routes);


const port = 3006; // Specify the port number you want to listen on
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
