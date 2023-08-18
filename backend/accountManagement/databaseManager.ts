import { User,IUser } from './models/user';

require('./config.js');
async function insertData(data: IUser) {
  try {
    const existingUser = await User.findOne({ ID: data.ID });
    if (existingUser) {
      return;
    }

    data.creation_date = new Date();
    const insertResult = await User.create(data);
    console.log('Inserted document:', insertResult);
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
}
export { insertData };
