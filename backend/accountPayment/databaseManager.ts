const  Register =require('./model.ts');
require('./config.js');
async function insertData(data) {
  try {
    const existingUser = await Register.findOne({ ID: data.ID });
    if (existingUser) {
      return;
    }

    data.date = new Date();

    const insertResult = await Register.save(data);
    console.log('Inserted document:', insertResult);
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
}

export { insertData };
