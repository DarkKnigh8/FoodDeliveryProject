const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const restaurantRoutes = require('./routes/restaurantRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/restaurants', restaurantRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Restaurant Management Service running on port ${PORT} 🚀`);
});
