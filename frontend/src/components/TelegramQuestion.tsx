
import axios from 'axios';

export async function fetchQuestionCategory(input:any) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const apiKey = process.env.API_KEY; 

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const data = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": `stands for: telegram alert  `
      }
    ]
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching question category:', error);
    return null;
  }
}
