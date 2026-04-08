import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { generateQuoteAndFeedback } from './claude.js';
import { saveQuote, getRanking, calculateRanks } from './storage.js';

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/generate-quote
app.post('/api/generate-quote', async (req, res) => {
  try {
    const { category, project_description, scope, timeline, requirements, budget } = req.body;

    if (!category || !project_description || !scope || !timeline || !requirements) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await generateQuoteAndFeedback({ category, project_description, scope, timeline, requirements, budget });

    const quoteRecord = {
      id: uuidv4(),
      category,
      input: { category, project_description, scope, timeline, requirements, budget },
      quote: result.quote,
      feedback: result.feedback,
      score: result.feedback.score,
      created_at: new Date().toISOString(),
    };

    saveQuote(quoteRecord);
    const { rank, category_rank } = calculateRanks(quoteRecord);

    res.json({
      id: quoteRecord.id,
      quote: result.quote,
      feedback: result.feedback,
      score: result.feedback.score,
      rank,
      category_rank,
    });
  } catch (err) {
    console.error('Error generating quote:', err);
    res.status(500).json({ error: err.message || 'Failed to generate quote' });
  }
});

// GET /api/ranking
app.get('/api/ranking', (req, res) => {
  try {
    const { category } = req.query;
    const ranking = getRanking(category || null);
    res.json(ranking);
  } catch (err) {
    console.error('Error fetching ranking:', err);
    res.status(500).json({ error: 'Failed to fetch ranking' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API Server running on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY is not set. Please add it to .env file.');
  }
});
