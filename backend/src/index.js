import express from 'express';
import toiletsRouter from './routes/toilets.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use('/api/toilets', toiletsRouter);

app.listen(PORT, () => {
    console.log(`server running on port:${PORT}`)
})