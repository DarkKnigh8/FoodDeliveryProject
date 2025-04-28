import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const socket = io('http://localhost:5003'); // Delivery service socket server

const DeliveryMap = ({ deliveryId }) => {
  const [position, setPosition] = useState([6.9271, 79.8612]); // Default location
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    // Fetch initial delivery status
    fetch(`http://localhost:5003/api/deliveries/${deliveryId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status) setStatus(data.status);
      });

    // Listen for real-time location updates
    socket.on(`delivery-${deliveryId}-location`, ({ lat, lng }) => {
      setPosition([lat, lng]);
    });

    // Listen for real-time status updates
    socket.on(`delivery-${deliveryId}-status`, ({ status }) => {
      setStatus(status);
    });

    return () => {
      socket.off(`delivery-${deliveryId}-location`);
      socket.off(`delivery-${deliveryId}-status`);
    };
  }, [deliveryId]);

  return (
    <div className="w-full h-[600px] rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-white p-4 text-lg font-medium border-b border-gray-300">
        Delivery Status: <span className="text-blue-600 capitalize">{status}</span>
      </div>
      <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="w-full h-[90%]">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;
