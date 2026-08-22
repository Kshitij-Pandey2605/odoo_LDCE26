import express from 'express';
import { generateAIItinerary } from '../services/aiService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/plan', async (req, res) => {
  try {
    const { destination, duration, budget, travelStyle, interests } = req.body;

    if (!destination || !duration || !budget) {
      return res.status(400).json({ error: 'Destination, duration, and budget limit are required.' });
    }

    const plan = await generateAIItinerary(destination, duration, budget, travelStyle, interests);
    res.json(plan);
  } catch (error) {
    console.error('AI Planning Route Error:', error);
    res.status(500).json({ error: 'Failed to generate travel plan.' });
  }
});

export default router;
