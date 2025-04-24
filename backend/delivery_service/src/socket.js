import { io } from "socket.io-client";

const socket = io("http://localhost:5003"); // Delivery service socket server

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");

  let lat = 6.9271;
  let lng = 79.8612;

  setInterval(() => {
    lat += 0.0003;
    lng += 0.0003;

    socket.emit("locationUpdate", {
      deliveryId: "driver123",
      lat,
      lng,
    });

    console.log(`Sent: ${lat}, ${lng}`);
  }, 2000);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});
