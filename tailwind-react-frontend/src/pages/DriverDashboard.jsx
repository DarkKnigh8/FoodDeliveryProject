import { useState, useEffect } from 'react';
import { deliveryAPI } from '../services/api';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const socket = io('http://localhost:5006');

const DriverDashboard = () => {
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState('');
  const [position, setPosition] = useState([6.9271, 79.8612]);

  useEffect(() => {
    const fetchAssignedDelivery = async () => {
      try {
        const res = await deliveryAPI.get('/deliveries/assigned');
        if (res.data) {
          setDelivery(res.data);
          if (res.data.driverLocation) {
            setPosition([
              res.data.driverLocation.lat,
              res.data.driverLocation.lng
            ]);
          }
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to load current delivery.');
      }
    };

    fetchAssignedDelivery();
  }, []);

  useEffect(() => {
    if (!delivery) return;

    socket.on(`track-${delivery._id}`, ({ lat, lng }) => {
      setPosition([lat, lng]);
    });

    return () => {
      if (delivery) {
        socket.off(`track-${delivery._id}`);
      }
    };
  }, [delivery]);

  const updateStatus = async (newStatus) => {
    if (!delivery) return;

    try {
      const res = await deliveryAPI.put(`/deliveries/${delivery._id}/status`, { status: newStatus });
      setDelivery(prev => ({ ...prev, status: res.data.status }));

      alert(`Status updated to ${newStatus}`);

      socket.emit(`delivery-${delivery._id}-status`, { status: newStatus });
    } catch (err) {
      console.error('Update Error:', err);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-5xl space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">🚚 Driver Dashboard</h1>
        {error && <p className="text-red-600 text-center">{error}</p>}

        {!delivery ? (
          <p className="text-center text-gray-600 text-lg">No deliveries assigned currently.</p>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p><span className="font-semibold">Order ID:</span> {delivery.orderId}</p>
                <p><span className="font-semibold">Restaurant:</span> {delivery.restaurantId}</p>
                <p><span className="font-semibold">Customer:</span> {delivery.customerId}</p>
                <p><span className="font-semibold">Status:</span> <span className="capitalize">{delivery.status}</span></p>
              </div>

              <div className="flex space-x-4 mt-4">
                {delivery.status === 'assigned' && (
                  <button 
                    onClick={() => updateStatus('picked')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                  >
                    Mark as Picked
                  </button>
                )}
                {delivery.status === 'picked' && (
                  <button 
                    onClick={() => updateStatus('delivered')}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>

            <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-300 shadow-md mt-8">
              <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} />
              </MapContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
