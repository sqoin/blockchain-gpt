import { Request, Response, Router } from 'express';
import { Register, IRegister } from '../models/model';

let tasksController = require("../controller/tasksController");
const router: Router = Router();

async function insertData(data: IRegister) {
  try {
    const existingUser = await Register.findOne({ ID: data.ID });
    if (existingUser) {
      return;
    }

    data.date = new Date();

    const insertResult = await Register.create(data);
    console.log('Inserted document:', insertResult);
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
}

router.post('/saveUserId', async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const existingUser = await Register.findOne({ ID: userId });
    if (existingUser) {
      const existingDate = existingUser.date.getTime();
      const currentDate = new Date().getTime();
      const dayDiff = Math.floor((currentDate - existingDate) / (1000 * 60 * 60 * 24));
            if (dayDiff >= 30) {
        return res.status(200).json({ message: "Free trial expired" });
      }
    }

    const dataToInsert: IRegister = { date: new Date(), ID: userId };
    await insertData(dataToInsert);

    console.log('User ID:', userId);
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error saving user ID:', error);
    return res.sendStatus(500);
  }
});


router.post('/tasks', tasksController.createTask);
router.get('/tasks/:userId', tasksController.getTasksByUserId);

module.exports= router;