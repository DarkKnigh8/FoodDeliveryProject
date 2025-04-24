import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { initSocket } from './socket.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // needed for socket.io

app.use(cors());
app.use(express.json());

app.use('/api/deliveries', deliveryRoutes);
app.use('/api/drivers', driverRoutes); // ✅ Moved up
app.use(errorHandler); // ✅ This must be last

// Start socket server
initSocket(server);

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Delivery Service running on port ${PORT}`);
});
