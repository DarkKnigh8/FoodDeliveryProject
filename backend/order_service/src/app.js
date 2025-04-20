const express = require("express");
require("dotenv").config();
require('./config/database'); // Ensure MongoDB connection;


const orderRoutes = require("./routes/orderRoutes");
const requestLogger = require("./middleware/requestLogger");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());
app.use(requestLogger); // Log incoming requests
const cors = require('cors');
app.use(cors());

app.use("/api/orders", orderRoutes); // Order routes

app.use(errorMiddleware); // Global error handler

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
