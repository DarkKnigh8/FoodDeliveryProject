import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import deliveryRoutes from './routes/deliveryRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { setupSocket } from './socket.js';
import { Server } from 'socket.io';

dotenv.config();

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/deliveries', deliveryRoutes); // ✅ Only deliveries

// Error Handler
app.use(errorHandler);

// Initialize WebSocket Server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Setup WebSocket events
setupSocket(io);

// Start Server
const PORT = process.env.PORT || 5006;
server.listen(PORT, () => {
  console.log(`🚀 Delivery Service running with WebSocket on port ${PORT}`);
});
