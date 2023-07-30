import { Request, Response, Router } from 'express';
import { Register, IRegister } from '../models/model';

import {insertData} from "../databaseManager";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import SuperTokens from 'supertokens-node';
import axios from 'axios';
const {supertokensConfig,mongoose} = require('../config.js')
let tasksController = require("../controller/tasksController");
const router: Router = Router();

let ID_user='';
let userEmail='';
let githubaccount='';
let name='';
let lastName='';
SuperTokens.init(supertokensConfig);


router.post('/saveUserId', async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const existingUser = await Register.findOne({ ID: userId });
    if (existingUser) {
      console.log("existing user: "+JSON.stringify(existingUser))
      name=existingUser.name;
      lastName= existingUser.lastName;
      const existingDate = existingUser.date.getTime();
      const currentDate = new Date().getTime();
      const dayDiff = Math.floor((currentDate - existingDate) / (1000 * 60 * 60 * 24));
            if (dayDiff >= 30) {
        return res.status(200).json({ message: "Free trial expired" });
      }
    }

    const dataToInsert: IRegister = { date: new Date(), ID: userId , name:'',lastName: ''};
    await insertData(dataToInsert);

    console.log('User ID:', userId, "name: ",name, "last name: ", lastName);
    let userInfo;
    try{
      userInfo= await ThirdPartyEmailPassword.getUserById(userId);
    } catch (error) {
      console.error('Error fetching ThirdPartyEmailPassword.getUserById:', error);
    }
    userEmail=userInfo?.email||"";
    console.log("userEmail is: "+userEmail);
    ID_user=userId;
    console.log('User information: ',userInfo);
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
    else{
      githubaccount='unavailable';
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error saving user ID:', error);
    return res.sendStatus(500);
  }
});
router.get('/getUserInfo', async (req: Request, res: Response) => {

  try {
    const userInfo = {
      userId: ID_user,
      email: userEmail, // Replace with the actual email retrieved from the database
      githubAccount:githubaccount,
      userName: name,
      userLastName: lastName
    };
  console.log("informations: "+JSON.stringify(userInfo));
    // Return the user information as a response
    return res.json(userInfo);
  } catch (error) {
    console.error('Error fetching user information:', error);
    return res.sendStatus(500);
  }
});

router.put('/updateUser',async (req: Request, res: Response) => {

  try {

      const userId= req.body.userId;
      //search method here
    const user = await Register.findOne({ ID: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.userName;
    user.lastName= req.body.userLastName;



    //update method here
    await user.save();
    }


   catch (error) {
    console.error('Error Updating user:', error);
    return res.sendStatus(500);
  }
})



router.post('/tasks', tasksController.createTask);
router.get('/tasks/:userId', tasksController.getTasksByUserId);

module.exports= router;