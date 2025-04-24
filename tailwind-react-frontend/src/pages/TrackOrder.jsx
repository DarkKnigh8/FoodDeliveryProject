import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function TrackOrder() {
  const { orderId } = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      const res = await fetch(`http://localhost:5005/api/orders/${orderId}/track`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();

      // ✅ Inject mock location if none exists
      if (!data.location || !data.location.lat || !data.location.lng) {
        data.location = { lat: 6.9271, lng: 79.8612 }; // Colombo mock location
      }

      setTracking(data);
      setLoading(false);
    };
    fetchTracking();
  }, [orderId]);

  if (loading) return <p className="text-center mt-10">Loading tracking info...</p>;
  if (!tracking) return <p className="text-center mt-10 text-red-500">Tracking not available</p>;

  const { status, location } = tracking;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Tracking Order #{orderId}</h1>

      {/* Status Display */}
      <div className="mb-4">
        <p className="text-gray-700 mb-1">Order Status:</p>
        <p className="text-xl font-semibold text-blue-600">{status}</p>
      </div>

      {/* Location Display */}
      <div className="mb-4">
        <p className="text-gray-700 mb-1">Current Location:</p>
        <p className="font-semibold">📍 Lat: {location.lat}, Lng: {location.lng}</p>
      </div>

      {/* Future map placeholder */}
      <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
        [ Map will appear here ]
      </div>
    </div>
  );
}
