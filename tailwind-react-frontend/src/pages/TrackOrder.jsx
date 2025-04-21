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
      setTracking(data);
      setLoading(false);
    };
    fetchTracking();
  }, [orderId]);

  if (loading) return <p className="text-center mt-10">Loading tracking info...</p>;
  if (!tracking) return <p className="text-center mt-10 text-red-500">Tracking not available</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tracking Order #{orderId}</h1>
      <p>Status: <span className="font-semibold text-blue-600">{tracking.status}</span></p>
      {tracking.location ? (
        <p>Current Location: 📍 {tracking.location.lat}, {tracking.location.lng}</p>
      ) : (
        <p>No location data available yet.</p>
      )}
    </div>
  );
}