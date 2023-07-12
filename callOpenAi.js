const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});




const openai = new OpenAIApi(configuration);


let callOpenAi = async (prompt) => {

  prompt = preprocess(prompt);
 console.log(prompt);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",//"gpt-3.5-turbo",
    messages: [
      
      { role: "assistant", content: readContentfromFile('assistant.txt')},
      { role: "user",
      content: prompt },
    ],
  });


  return completion.data.choices[0].message.content;
}

let preprocess = (prompt) => {
  return prompt + readContentfromFile("preprocess.txt")
}

let readContentfromFile = (filename) => {
  return fs.readFileSync(filename, 'utf8');
}

module.exports = callOpenAi;

