import express from 'express';
import cors from 'cors';
import toiletsRouter from './routes/toilets.js';

const app = express();
const PORT = 3000;

//Middleware
app.use(cors())
app.use(express.json());


// Routes
app.use(express.json());

// Routes
app.use('/toilets', toiletsRouter);

//Root
app.get('/', (req, res) => {
  res.send('Toilet Finder API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});