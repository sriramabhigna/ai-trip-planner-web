/*const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for frontend requests
app.use(cors());

app.get('/api/google-images', async (req, res) => {
  const { q } = req.query;
  
  try {
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(q)}&tbm=isch`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const images = [];

    $('img[src^="http"]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.includes('google.com/images/branding')) {
        images.push(src);
      }
    });

    res.json({ images: images.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));*/ 
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/google-images', (req, res) => {
  const query = req.query.q;
  console.log(`Received query: ${query}`);

  // You can customize this based on query if needed
  const images = [
    'https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/65/Eiffel_Tower_Paris_France_2014.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/17/Louvre_Museum_Wikimedia_Commons.jpg'
  ];

  res.json({ images });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
