import axios from 'axios';

export async function fetchQuestionCategory(input:any) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const apiKey = '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'; 

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const data = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": `1 stands for: Technology: Questions related to computers, software, hardware, gadgets, internet, programming, cybersecurity, artificial intelligence, etc. 2 stands for: Weather: Questions about current weather conditions, climate change, meteorology, extreme weather events, and natural disasters. 3 stands for: Nature: Inquiries about wildlife, ecosystems, biodiversity, environmental conservation, geology, and natural phenomena. 4 stands for: Science: Queries concerning various scientific disciplines such as physics, chemistry, biology, astronomy, psychology, and more. 5 stands for: History: Questions about historical events, figures, cultures, civilizations, and significant milestones. 6 stands for: Health and Medicine: Inquiries about medical conditions, treatments, nutrition, exercise, mental health, and healthcare practices. 7 stands for: Space and Astronomy: Questions about celestial bodies, space exploration, planets, stars, galaxies, and the universe. 8 stands for: Society and Culture: Queries related to social issues, customs, traditions, languages, art, music, literature, and anthropology. 9 stands for: Mathematics: Questions about mathematical concepts, equations, calculations, and applications. 10 stands for: Sports and Recreation: Inquiries about various sports, athletes, rules, records, and recreational activities. 11 stands for: Cryptocurrency related questions. 0 stands for: The question does not make sense or it is a Fiction or Hypothetical Scenario. 00 stands for: You cannot answer this question because of legal reasons. based on this list, can you tell me which category the question: (${input}) belongs to, answer me as follows: topic: topicNumber, topicName`
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
