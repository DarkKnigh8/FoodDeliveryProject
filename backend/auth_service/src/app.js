import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import { configureHelmet } from './config/helmetConfig.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
configureHelmet(app);

// Routes
app.use('/api/auth', authRoutes);

// MongoDB connection + server start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'authdb',
  })
  .then(() => {
    console.log('Auth service connected to MongoDB');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Auth service running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));

export default app;
