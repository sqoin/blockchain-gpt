import { Request, Response, Router } from 'express';
import { chat, Ichat } from '../model';
import { insertData } from '../databaseManager';
import { sendHelloMessageToAll } from '../message'  ;

const router: Router = Router();


router.post('/telegram/chat', async (req: Request, res: Response) => {
  const { chatId } = req.body;

  try {
    const dataToInsert: Ichat =  { chatId: chatId};
    await insertData(dataToInsert);

    console.log('chat ID:', chatId);
     // Call the function to send hello messages to all chat IDs
     await sendHelloMessageToAll();

     return res.sendStatus(200);
  } catch (error) {
    console.error('Error saving user ID:', error);
    return res.sendStatus(500);
  }
});

module.exports = router;
