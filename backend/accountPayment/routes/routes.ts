const express = require('express');
const { connectToDatabase, insertData } = require('../databaseManager.ts');

const router = express.Router();
const collectionName = 'blockchaingpt';

router.post('/saveUserId', async (req, res) => {
  const { userId } = req.body;

  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);

    const existingUser = await collection.findOne({ ID: userId });
    if (existingUser) {
      const existingDate = existingUser.date;
      const currentDate = new Date();
      const dayDiff = Math.floor((currentDate - existingDate) / (1000 * 60 * 60 * 24));
      if (dayDiff >= 30) {
        return res.status(200).json({ message: "Free trial expired" });
      }
    }

    const dataToInsert = { date: new Date(), ID: userId };
    await insertData(dataToInsert);

    console.log('User ID:', userId);
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error saving user ID:', error);
    return res.sendStatus(500);
  }
});

module.exports = router;
