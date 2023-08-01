import { Request, Response, Router } from 'express';
import { chat, Ichat } from '../model';
import { sendHelloMessageToAll } from '../message'  ;
let databaseManager = require("../databaseManager");

const router: Router = Router();


router.post('/telegram/chat', async (req: Request, res: Response) => {
  const  chatId= req.body.chatId;
  const userId=req.body.userId ;

  try {
    const dataToInsert: Ichat =  { chatId: chatId,userId : userId};
    await databaseManager.insertData(dataToInsert);

    console.log('chat ID:', chatId);
    console.log('user id',userId);
     // Call the function to send hello messages to all chat IDs
    // await sendHelloMessageToAll();

     return res.sendStatus(200);
  } catch (error) {
    console.error('Error saving user ID:', error);
    return res.sendStatus(500);
  }
});
router.get('/telegram/chat/:userId',databaseManager.getDataByUserId);

module.exports = router;
