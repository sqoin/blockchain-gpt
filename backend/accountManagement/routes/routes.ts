import { Request, Response, Router } from 'express';
import { Register, IRegister } from '../models/model';
import { insertData } from "../databaseManager";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import SuperTokens from 'supertokens-node';
import axios from 'axios';
import multer from 'multer';
import imageController from '../controller/imageController';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });



let tasksController = require("../controller/tasksController");
const router: Router = Router();
const config = require('../config')
let ID_user = '';
let userEmail = '';
let githubaccount = '';
let name = '';
let lastName = '';
let telegramUserName = '';
let email = '';
SuperTokens.init(config.supertokensConfig);


router.post('/saveUserId', async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const existingUser = await Register.findOne({ ID: userId });
    if (existingUser) {
      console.log("existing user: " + JSON.stringify(existingUser))
      name = existingUser.name;
      lastName = existingUser.lastName;
      const expiration_date = existingUser.expiration_date?.getTime();
      const currentDate = new Date().getTime();
      if (currentDate >= expiration_date) {
        return res.status(200).json({ message: "Free trial expired" });
      }
    }
    let userInfo;
    try {
      userInfo = await ThirdPartyEmailPassword.getUserById(userId);
    } catch (error) {
      console.error('Error fetching ThirdPartyEmailPassword.getUserById:', error);
    }
    userEmail = userInfo?.email || "";
    console.log("userEmail is: " + userEmail);
    ID_user = userId;
    console.log('User information: ', userInfo);

    const dataToInsert: IRegister = {
      creation_date: new Date(), ID: userId, name: '', lastName: '', email: userEmail, expiration_date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      account_status: 'freeAccount', telegram_user_name: ''
    };
    await insertData(dataToInsert);

    console.log('User ID:', userId, "name: ", name, "last name: ", lastName);

    if (userInfo?.thirdParty?.id === 'github') {
      const url = 'https://api.github.com/user/' + userInfo?.thirdParty?.userId;
      try {
        const gitResponse = await axios.get(url);
        const data = gitResponse.data;
        githubaccount = data.html_url;
        console.log(githubaccount);
      } catch (error) {
        console.error('Error fetching GitHub URL:', error);
      }
    }
    else {
      githubaccount = 'unavailable';
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error saving user ID:', error);
    return res.sendStatus(500);
  }
});

router.get('/getUserById/:id', async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.id;
    console.log(userId);
    const user = await Register.findOne({ ID: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user by ID" });
  }
});


router.put('/updateUser', async (req: Request, res: Response) => {

  try {

    const userId = req.body.userId;
    //search method here
    const user = await Register.findOne({ ID: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.userName;
    user.lastName = req.body.userLastName;
    user.telegram_user_name = req.body.telegram_user_name;
    await user.save();
    return res.status(200).json({ message: 'User updated successfully' });
  }
  catch (error) {
    console.error('Error Updating user:', error);
    return res.sendStatus(500);
  }
})

router.post('/updateUserStatus', async (req: Request, res: Response) => {
  const id = req.body.id;

  try {
    const user = await Register.findOne({ ID: id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const expirationDate = new Date(user.expiration_date);
    expirationDate.setMonth(expirationDate.getMonth() + 2);

    user.expiration_date = expirationDate;
    user.account_status = "PaidAccount";

    await user.save();

    return res.json({ message: 'User status updated successfully', newExpirationDate: expirationDate });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/tasks', tasksController.createTask);
router.get('/tasks/:userId', tasksController.getTasksByUserId);

router.put('/tasks/stopTask', tasksController.updateTaskStopped);
// Backend route to get tasks with non-null duration
router.get('/tasksvalid/:userId', tasksController.getTasksWithNonZeroDuration);



router.post('/uploadimage', upload.single('image'), imageController.uploadImage);
router.get('/getimage/:userId', imageController.getImagesByUser);

module.exports = router;