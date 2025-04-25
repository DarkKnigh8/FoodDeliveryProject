const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const setupSocket = require('./socket');

const deliveryRoutes = require('./routes/deliveryRoutes');
require('dotenv').config();
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // Apply CORS to all routes

// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Same as the frontend URL
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/deliveries', deliveryRoutes);

// WebSocket events (Handle your Socket.io logic here)
setupSocket(io);

// Start everything
const PORT = process.env.PORT || 5006;
server.listen(PORT, () => {
  console.log(`Delivery Service running with WebSocket on port ${PORT}`);
});
