import express from 'express';
import cors from 'cors';
import certificateRoutes from './routes/certificateRoutes.js';

const app = express();
const port = 80;

app.use(cors({
  origin: 'https://web.carlosmartinez.bloock.xyz',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

app.use('/certificate', certificateRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
