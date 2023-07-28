import { response } from 'express';
import { chat, Ichat } from './model';


const express = require('express');
const fs = require('fs');
const cors = require("cors");
const app = express();
const axios= require("axios")
const bodyParser = require('body-parser');
const routes = require('./routes/routes.ts');

app.use(express.json());



app.use(bodyParser.json());
app.use('/api', routes);


const port = 3006; // Specify the port number you want to listen on
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
