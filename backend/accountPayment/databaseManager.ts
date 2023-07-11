
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'blockchaingpt';
const collectionName = 'blockchaingpt';

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(url);
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

async function testConnection() {
  try {
    const database = await connectToDatabase();
    console.log('Connection test successful!');
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

async function insertData(data) {
  try {
    const db = await connectToDatabase();
    testConnection();
    const collection = db.collection(collectionName);

    const existingUser = await collection.findOne({ ID: data.ID });
    if (existingUser) {
      return;
    }

    data.date = new Date();

    // Insert a single document
    const insertResult = await collection.insertOne(data);
    console.log('Inserted document:', insertResult.insertedId);
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
}


module.exports = { connectToDatabase,testConnection, insertData };
