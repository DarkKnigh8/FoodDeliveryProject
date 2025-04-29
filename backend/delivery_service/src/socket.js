import Delivery from './models/Delivery.js';
import { Server } from 'socket.io';

let io; // To store the instance globally

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Frontend URL
      methods: ['GET', 'POST', 'PUT'],
      credentials: true
    },
  });

  io.on('connection', (socket) => {
    console.log('🚀 WebSocket Connected:', socket.id);

    // Clients join specific delivery room
    socket.on('joinDelivery', ({ deliveryId }) => {
      if (deliveryId) {
        socket.join(`delivery-${deliveryId}`);
        console.log(`👥 Client joined delivery room: delivery-${deliveryId}`);
      }
    });

    // Driver sends location updates
    socket.on('driverLocationUpdate', async ({ deliveryId, lat, lng }) => {
      try {
        if (!deliveryId || lat === undefined || lng === undefined) {
          console.warn('⚠️ Missing location update fields');
          return;
        }

        console.log(`📍 Driver location update for ${deliveryId}: ${lat}, ${lng}`);

        // Update in database
        await Delivery.findByIdAndUpdate(deliveryId, {
          driverLocation: { lat, lng },
          lastLocationUpdate: new Date()
        });

        // Broadcast to all clients tracking this delivery
        io.to(`delivery-${deliveryId}`).emit('driverLocationUpdate', { 
          deliveryId, 
          lat, 
          lng,
          timestamp: new Date()
        });
      } catch (err) {
        console.error(`❌ Error updating delivery location for ${deliveryId}:`, err.message);
      }
    });

    // Update delivery status
    socket.on('updateDeliveryStatus', async ({ deliveryId, status }) => {
      try {
        if (!deliveryId || !status) {
          console.warn('⚠️ Missing status update fields');
          return;
        }

        console.log(`📝 Status update for ${deliveryId}: ${status}`);

        // Update in database
        await Delivery.findByIdAndUpdate(deliveryId, { 
          status,
          statusUpdatedAt: new Date(),
          ...(status === 'delivered' ? { deliveredAt: new Date() } : {} )
        });

        // Broadcast to all clients tracking this delivery
        io.to(`delivery-${deliveryId}`).emit('delivery-status-update', { 
          deliveryId, 
          status,
          timestamp: new Date() 
        });
      } catch (err) {
        console.error(`❌ Error updating delivery status for ${deliveryId}:`, err.message);
      }
    });

    // Handle client request for delivery data
    socket.on('getDeliveryInfo', async ({ deliveryId }) => {
      try {
        if (!deliveryId) {
          console.warn('⚠️ Missing deliveryId in getDeliveryInfo');
          return;
        }
        
        const delivery = await Delivery.findById(deliveryId);
        if (delivery) {
          // Send back to requesting client only
          socket.emit('deliveryInfo', {
            deliveryId,
            data: delivery,
            restaurantLocation: delivery.restaurantLocation,  // Assume it's in the DB
            customerLocation: delivery.customerLocation,  // Assume it's in the DB
          });
        }
      } catch (err) {
        console.error(`❌ Error fetching delivery info for ${deliveryId}:`, err.message);
      }
    });

    // Handle error reporting from clients
    socket.on('reportError', ({ deliveryId, errorType, message }) => {
      console.error(`⚠️ Client error report for ${deliveryId}: ${errorType} - ${message}`);
      // Here you could log to a database or monitoring system
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};

// Safe getter to use io anywhere
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Use this in your API routes to emit events
export const emitDeliveryUpdate = (deliveryId, event, data) => {
  if (!io) return;
  io.to(`delivery-${deliveryId}`).emit(event, { deliveryId, ...data });
};
