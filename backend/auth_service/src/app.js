import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Auth service connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`Auth service running on port ${process.env.PORT}`);
  });
})
.catch((err) => console.error('MongoDB connection error:', err));
