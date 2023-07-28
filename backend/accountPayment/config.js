const mongoose =require('mongoose');
const ThirdPartyEmailPassword = require("supertokens-node/recipe/thirdpartyemailpassword");
require('dotenv').config();

const url = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PWD + "@" + process.env.DB_CLUSTER + ".mongodb.net/?retryWrites=true&w=majority" || '';
const databaseName = 'blockchaingpt';

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true, dbName: databaseName })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to the database:', error));




let supertokensConfig = {
    supertokens: {
        connectionURI: process.env.CONNECTION_URI || "",
        apiKey: process.env.APIKEY || "",
    },
    appInfo: {
        appName: 'blockchaingGpt',
        apiDomain: 'http://localhost:3003',
        websiteDomain: 'http://localhost:3000',
    },
    recipeList: [ThirdPartyEmailPassword.init({})],
}



module.exports= {mongoose, supertokensConfig};