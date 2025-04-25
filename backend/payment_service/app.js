require('dotenv').config();
console.log("Stripe Key (DEBUG):", process.env.STRIPE_SECRET_KEY);

const express = require('express');
const mongoose = require('mongoose');
//const dotenv = require('dotenv');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();




app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));


app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Payment service running on port ${PORT}`));
