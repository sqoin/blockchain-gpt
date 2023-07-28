const mongoose =require('mongoose');
require('dotenv').config();

const url = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PWD + "@" + process.env.DB_CLUSTER + ".mongodb.net/?retryWrites=true&w=majority" || '';
const databaseName = 'blockchaingpt';

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true, dbName: databaseName })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to the database:', error));

module.exports= mongoose;
