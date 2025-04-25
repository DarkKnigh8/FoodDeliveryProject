import Delivery from './models/Delivery.js';
import { Server } from 'socket.io';

let io;

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('WebSocket Connected:', socket.id);

    socket.on('driverLocationUpdate', async ({ deliveryId, lat, lng }) => {
      try {
        await Delivery.findByIdAndUpdate(deliveryId, { driverLocation: { lat, lng } });
        io.emit(`track-${deliveryId}`, { lat, lng });
      } catch (err) {
        console.error(`Error updating delivery location for ${deliveryId}:`, err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
