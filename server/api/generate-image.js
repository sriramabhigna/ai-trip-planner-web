// server/api/generate-image.js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

router.get('/', async (req, res) => {
  const query = req.query.prompt;
  if (!query) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();

    if (!data?.urls?.regular) {
      return res.status(404).json({ error: 'No image found' });
    }

    res.json({ imageUrl: data.urls.regular });
  } catch (err) {
    console.error('Unsplash API error:', err);
    res.status(500).json({ error: 'Image fetch failed' });
  }
});

export default router;
