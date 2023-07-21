import { Request, Response, Router } from 'express';
import { chat, Ichat } from '../model';
import { insertData } from '../databaseManager';

const router: Router = Router();


router.post('/telegramChat', async (req: Request, res: Response) => {
  const { chatId } = req.body;

  try {
    const dataToInsert: Ichat =  { chatId: chatId};
    await insertData(dataToInsert);

    console.log('chat ID:', chatId);
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error saving user ID:', error);
    return res.sendStatus(500);
  }
});

module.exports = router;
