const express = require('express');
const fs = require('fs');
const cors = require("cors");
const app = express();

app.use(express.json());

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
