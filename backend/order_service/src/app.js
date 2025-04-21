const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { requestLogger } = require('./middleware/requestLogger');



dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/orders', orderRoutes);



// Error handler (should be last)
app.use(errorHandler);

// Start server directly here
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
