const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const setupSocket = require('./socket');
const deliveryRoutes = require('./routes/deliveryRoutes'); // <-- Make sure this exists
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

app.use(cors(corsOptions));
app.use(express.json());

// WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
setupSocket(io); // Hook the WebSocket events

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// REST API Routes
app.use('/api/deliveries', deliveryRoutes); // Only delivery routes for now

// Start Server
const PORT = process.env.PORT || 5006;
server.listen(PORT, () => {
  console.log(`🚚 Delivery Service running with WebSocket on port ${PORT}`);
});
