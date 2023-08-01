import { response } from 'express';
import { chat, Ichat } from './model';
import {sendHelloMessageToAll} from './message';
const cors = require('cors');


const express = require('express');
const fs = require('fs');

const app = express();
const axios= require("axios")
const bodyParser = require('body-parser');
const routes = require('./routes/routes.ts');


app.use((req:any, res: any, next:any) => {
  res.payload = {};
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
  res.header("X-Frame-Options: SAMEORIGIN");
  next();
});



app.use(express.json());
app.use(bodyParser.json());
app.use('/api', routes);

app.post('/sendHelloToAll', async (req:any, res:any) => {
  try {
    await sendHelloMessageToAll();
    res.sendStatus(200); // Sending a success response to the frontend
  } catch (error) {
    console.error('Error sending hello message to all chats:', error);
    res.sendStatus(500); // Sending an error response to the frontend
  }
});


const port = 3006; // Specify the port number you want to listen on
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
