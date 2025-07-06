// backend/index.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  try {
    const prompt = `
generate flirty line for my crush
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // or try "openai/gpt-3.5-turbo"
        messages: [
          { role: "system", content: "generate flirty line for my crush" },
          { role: "user", content: prompt }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    res.json({ line: reply });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Error generating line' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
