import { chat } from "./model";
import { Ichat } from "./model";
import { Request, Response } from "express";
require('./config')
exports.insertData = async(data: Ichat) => {
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
exports.getDataByUserId = async (req: Request, res: Response) =>  {
  try {
    const userId = req.params.userId;
    const chatsByUserId = await chat.find({ userId });

    if (chatsByUserId.length > 0) {
      res.status(200).json(chatsByUserId);
    } else {
      res.status(404).json({ message: 'Chats not found for this userId' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
