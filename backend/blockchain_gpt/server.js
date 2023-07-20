var express = require("express");
const cors = require('cors');
const axios = require('axios')
var bodyParser = require("body-parser");
let commandroutes = require("./routes/commandroutes");

var app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


var router = express.Router();

router.post("/execute-command", commandroutes.chatgpt);



router.get('/chat/:conversationId', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const apiKey = process.env.API_KEY; 
    
    const messages = await getChatHistory(conversationId, apiKey);
    res.json(messages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history.' });
  }
});

async function getChatHistory(conversationId, apiKey) {
  try {
    const response = await axios.get(`https://api.openai.com/v1/conversations/${conversationId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return response.data.messages;
  } catch (error) {
    console.error('Failed to retrieve chat history:', error);
    throw error;
  }
}

router.post('/chat', async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    const initialMessage = req.body.message; 

    const conversation = await createConversation(apiKey, initialMessage);
    const conversationId = conversation.id;
    console.log(conversationId);
    res.json({ conversationId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create a conversation.' });
  }
});

async function createConversation(apiKey, initialMessage) {
  try {
    const response = await axios.post('https://api.openai.com/v1/conversations', {
      messages: [
        {
          role: 'system',
          content: 'You are a customer support agent.',
        },
        {
          role: 'user',
          content: initialMessage,
        },
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to create a conversation:', error);
    throw error;
  }
}



app.use("/api", router);
app.listen(3040);
