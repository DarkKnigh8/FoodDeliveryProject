import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import deliveryRoutes from './routes/deliveryRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { setupSocket } from './socket.js'; // Named import

dotenv.config();

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/deliveries', deliveryRoutes);

// Error Handler (should be last middleware)
app.use(errorHandler);

// Initialize WebSocket
setupSocket(server); // Using the named export

const PORT = process.env.PORT || 5006;
server.listen(PORT, () => {
  console.log(`Delivery Service running with WebSocket on port ${PORT}`);
});
