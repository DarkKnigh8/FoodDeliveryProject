import { useState, useEffect } from 'react';
import { deliveryAPI } from '../services/api'; // Assuming you have the deliveryAPI service

const DriverDashboard = () => {
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the assigned delivery for the logged-in driver
    const fetchAssignedDelivery = async () => {
      try {
        const res = await deliveryAPI.get('/deliveries/assigned');
        if (res.data) {
          setDelivery(res.data); // Set the assigned delivery
        } else {
          setDelivery(null); // No delivery assigned
        }
      } catch (err) {
        setError('Failed to load current delivery');
      }
    };

    fetchAssignedDelivery();
  }, []);

  const updateStatus = async (newStatus) => {
    if (!delivery) return;

    try {
      const res = await deliveryAPI.put(`/deliveries/${delivery._id}/status`, { status: newStatus });
      setDelivery(prev => ({ ...prev, status: res.data.status }));
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      {!delivery ? (
        <p>No deliveries assigned currently.</p>
      ) : (
        <div className="border p-4 rounded">
          <p><strong>Order ID:</strong> {delivery.orderId}</p>
          <p><strong>Address:</strong> {delivery.address}</p>
          <p><strong>Status:</strong> {delivery.status}</p>
          <div className="mt-2">
            {delivery.status === 'assigned' && (
              <button 
                onClick={() => updateStatus('picked')}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Mark as Picked
              </button>
            )}
            {delivery.status === 'picked' && (
              <button 
                onClick={() => updateStatus('delivered')}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Mark as Delivered
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
