import {IRegister, Register} from "./models/model";

require('./config.js');
async function insertData(data: IRegister) {
  try {
    const existingUser = await Register.findOne({ ID: data.ID });
    if (existingUser) {
      return;
    }

    data.creation_date = new Date();

    const insertResult = await Register.create(data);
    console.log('Inserted document:', insertResult);
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
}
export { insertData };
