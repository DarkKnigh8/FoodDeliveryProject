import { useState } from 'react';
import { deliveryAPI } from '../services/api'; // Import deliveryAPI

const DeliveryStatusUpdater = ({ deliveryId }) => {
  const [status, setStatus] = useState('');

  const updateStatus = async () => {
    try {
      const res = await deliveryAPI.put(`/deliveries/${deliveryId}/status`, { status });
      alert(`Status updated to ${res.data.status}`);
    } catch (err) {
      console.error('Update failed', err);
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md mt-4 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2">Update Delivery Status</h2>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full mb-4"
      >
        <option value="">Select Status</option>
        <option value="assigned">Assigned</option>
        <option value="picked">Picked</option>
        <option value="delivered">Delivered</option>
      </select>
      <button
        onClick={updateStatus}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Update Status
      </button>
    </div>
  );
};

export default DeliveryStatusUpdater;
