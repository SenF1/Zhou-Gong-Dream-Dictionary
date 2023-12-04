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

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const dbPath = 'dreams.db'; 

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    createTable(db);
    console.log('Connected to the dreams database.');
});

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

app.post('/interpret-dream', async (req, res) => {
  const userDream = req.body.dreamDescription;
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant knowledgeable in Zhou Gong's Dream Dictionary. You will respond in either English or Chinese based on the language of the dream described. You will limit your response within 50 words." },
        { role: "user", content: `I had a dream where ${userDream}. Can you interpret this based on Zhou Gong's Dream Dictionary?"` },
      ],
      model: "gpt-3.5-turbo-1106",
      max_tokens: 200,
    });
    res.send(`${completion.choices[0].message.content}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});

app.get('/dreams', (req, res) => {
  let sql = `SELECT * FROM dreams;`
  db.all(sql, [], (err, rows) => {
      res.send(rows);
    });
});

app.post('/dream', (req, res) => {
  let newName = req.body.name;
  let newDescription = req.body.description;
  let newLocation = req.body.location;

  let sql = `
    INSERT INTO dreams (name, description, location, timestamp)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `;
  
  db.run(sql, [newName, newDescription, newLocation], function (err) {
    if (err) {
      console.log(err);
      res.status(500).send('Error inserting dream into the database.');
    } else {
      const newId = this.lastID;
      const timestamp = new Date().toISOString();
      res.status(200).json({
        success: true,
        message: 'Dream inserted successfully',
        id: newId,
        timestamp: timestamp
      });
    }
  });
  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function createTable(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS dreams
    (
      id INTEGER PRIMARY KEY,
      name TEXT,
      description TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      location TEXT
    );
  `);
}

function cleanup() {
  console.log('\nCleanup called');
  db.close();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);