const Delivery = require('./models/Delivery');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('WebSocket Connected:', socket.id);

    // Driver sends live location
    socket.on('driverLocationUpdate', async ({ deliveryId, lat, lng }) => {
      await Delivery.findByIdAndUpdate(deliveryId, { driverLocation: { lat, lng } });
      io.emit(`track-${deliveryId}`, { lat, lng });
    });
  });
};

module.exports = setupSocket;
