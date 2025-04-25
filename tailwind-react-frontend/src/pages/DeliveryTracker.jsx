// src/pages/DeliveryTracker.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDeliveryDetails } from '../services/api';
import io from 'socket.io-client';

const socket = io('http://localhost:5006'); // ✅ Make sure backend is on 5006

export default function DeliveryTracker() {
  const { deliveryId } = useParams();
  const [driverLocation, setDriverLocation] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  useEffect(() => {
    const loadDelivery = async () => {
      const data = await fetchDeliveryDetails(deliveryId);
      setDeliveryInfo(data);
      setDriverLocation(data.driverLocation);
    };

    loadDelivery();

    socket.on(`track-${deliveryId}`, (location) => {
      setDriverLocation(location);
    });

    return () => {
      socket.off(`track-${deliveryId}`);
    };
  }, [deliveryId]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Status for Order #{deliveryId}</h1>

      {driverLocation ? (
        <div>
          <p>🚗 Driver is at:</p>
          <p>Latitude: {driverLocation.lat}</p>
          <p>Longitude: {driverLocation.lng}</p>
        </div>
      ) : (
        <p>Loading driver location...</p>
      )}

      {deliveryInfo && (
        <div className="mt-4">
          <p><strong>Status:</strong> {deliveryInfo.status}</p>
          <p><strong>Assigned Driver:</strong> {deliveryInfo.assignedDriver?.name || 'Unknown'}</p>
          <p><strong>Address:</strong> {deliveryInfo.address}</p>
        </div>
      )}
    </div>
  );
}
