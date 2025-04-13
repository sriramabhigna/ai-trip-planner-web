// server/server.js

import express from 'express';
import generateImageRoute from './api/generate-image.js';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use('/api/generate-image', generateImageRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
