import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { fetchDeliveryDetails } from '../services/api';

// Setup Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Connect socket
const socket = io('http://localhost:5006');

const steps = ['pending', 'assigned', 'picked', 'delivered'];

const DeliveryMap = ({ deliveryId }) => {
  const [position, setPosition] = useState([6.9271, 79.8612]); // Default Colombo
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    const loadDelivery = async () => {
      try {
        const data = await fetchDeliveryDetails(deliveryId);  // ✅ Correct
        console.log('📦 Delivery fetched:', data);
        if (data?.status) setStatus(data.status.toLowerCase());
        if (data?.driverLocation) {
          setPosition([data.driverLocation.lat, data.driverLocation.lng]);
        }
      } catch (err) {
        console.error('Error fetching delivery details:', err);
      }
    };

    loadDelivery();

    // Listen for real-time status and location
    socket.on(`delivery-${deliveryId}-status`, ({ status }) => {
      console.log('📡 Status update received:', status);
      setStatus(status.toLowerCase());
    });

    socket.on(`track-${deliveryId}`, ({ lat, lng }) => {
      console.log('📡 Location update received:', lat, lng);
      setPosition([lat, lng]);
    });

    return () => {
      socket.off(`delivery-${deliveryId}-status`);
      socket.off(`track-${deliveryId}`);
    };
  }, [deliveryId]);

  return (
    <div className="w-full rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-white p-4">
        <div className="text-lg font-medium mb-4">
          Delivery Status: <span className="capitalize text-blue-600">{status}</span>
        </div>

        {/* Step Progress */}
        <div className="flex justify-between items-center mb-6">
          {steps.map((step, index) => {
            const currentIndex = steps.indexOf(status);
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            const circleStyle = isCompleted
              ? 'bg-green-500 text-white'
              : isCurrent
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-600';

            const labelStyle = isCompleted
              ? 'text-green-600'
              : isCurrent
              ? 'text-blue-600 font-semibold'
              : 'text-gray-500';

            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${circleStyle}`}>
                  {index + 1}
                </div>
                <p className={`mt-1 text-sm ${labelStyle}`}>{step.charAt(0).toUpperCase() + step.slice(1)}</p>
              </div>
            );
          })}
        </div>

        {/* Map */}
        <div className="h-[500px] w-full border rounded-lg overflow-hidden">
          <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="w-full h-full">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
