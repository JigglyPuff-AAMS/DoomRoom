import express from 'express';
import toiletsRouter from './routes/toilets.js';


const app = express();
app.use(express.json());

const PORT = 3000;

app.use('/api/toilets', toiletsRouter);

app.listen(PORT, () => {
    console.log(`server running on port:${PORT}`)
})