
import axios from 'axios';
import { chat } from './model'; // Adjust the path to your model file

async function sendHelloMessageToAll() {
  try {
    // Fetch all chat IDs from the database
    const chatIds = await chat.find({}, 'chatId'); // Only retrieve the 'chatId' field

    console.log("start sending alerts..", chatIds);

    // Send the "hello message" to each chat ID using the custom function
    chatIds.forEach((chat) => {
      const telegramApiUrl = `https://api.telegram.org/bot5856888046:AAH4B7M6Rcei9RFvlyYlbmNWMscMjmKUuRs/sendMessage?chat_id=${chat.chatId}&text=hello`;
      axios.get(telegramApiUrl)
        .then((response: any) => {
          console.log('Message sent to Telegram:', response.data);
        })
        .catch((error: any) => {
          console.error('Error sending message to Telegram:', error);
        });
    });
  } catch (error) {
    console.error('Error fetching chat IDs:', error);
  }
}

export { sendHelloMessageToAll };
