const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Admin Service is running');
});

// ✅ Centralized error handler
app.use((err, req, res, next) => {
  // Log the detailed error internally
  console.error(`[${new Date().toISOString()}]`, err);

  // Send only generic message to clients
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal server error', // ✅ safe generic message
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Admin Service running on port ${PORT}`);
});



// Added a centralized error handler at the end of the middleware stack.

// Logs the full error object to the server console.

// Responds with generic safe message ("Internal server error").

// No more err.message to clients. Attackers can’t learn database engine, driver, or file paths from responses.