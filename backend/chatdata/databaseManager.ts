import { chat } from "./model";
import { Ichat } from "./model";
require('./config')
async function insertData(data: Ichat) {
  try {
    const existingUser = await chat.findOne({ chatId: data.chatId });
    if (existingUser) {
      return;
    }

    const documentToInsert = new chat({
      chatId: data.chatId,
      userId: data.userId,
    }); 
    const insertResult = await documentToInsert.save(); // Save the document to the database
    console.log('Inserted document:', insertResult);
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
}

export { insertData };
