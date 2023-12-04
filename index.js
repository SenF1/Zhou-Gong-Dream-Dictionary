import { config } from "dotenv";
import OpenAI from "openai";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';

config();
const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

app.post('/interpret-dream', async (req, res) => {
  const userDream = req.body.dreamDescription;
  // try {
  //   const completion = await openai.chat.completions.create({
  //     messages: [
  //       { role: "system", content: "You are a helpful assistant knowledgeable in Zhou Gong's Dream Dictionary. You will respond in either English or Chinese based on the language of the dream described. You will limit your response within 50 words." },
  //       { role: "user", content: `I had a dream where ${userDream}. Can you interpret this based on Zhou Gong's Dream Dictionary?"` },
  //     ],
  //     model: "gpt-3.5-turbo-1106",
  //     max_tokens: 200,
  //   });
  //   res.send(`${completion.choices[0].message.content}`);
  // } catch (error) {
  //   console.error('Error:', error);
  //   res.status(500).send('An error occurred');
  // }
  res.send(`Interpretation:`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
