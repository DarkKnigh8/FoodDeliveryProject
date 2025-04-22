import { useEffect, useState } from 'react';
import { fetchMyOrders, updateOrderStatus } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchMyOrders();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;

    await updateOrderStatus(orderId, 'Cancelled');
    loadOrders();
  };

  const handleTrack = (orderId) => {
    // For now, just redirect to dummy track page or log
    navigate(`/track/${orderId}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white border p-4 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-semibold">Order ID: {order._id}</p>
              <span className={`text-sm font-medium ${order.status === 'Cancelled' ? 'text-red-600' : 'text-green-600'}`}>
                {order.status}
              </span>
            </div>

            <ul className="text-sm space-y-1 mb-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>LKR {item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="text-right font-bold text-blue-700">
              Total: LKR {order.totalPrice}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 mt-4">
              {order.status === 'Pending' && (
                <button
                  onClick={() => handleCancel(order._id)}
                  className="px-4 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Cancel Order
                </button>
              )}

              {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                <button
                  onClick={() => handleTrack(order._id)}
                  className="px-4 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Track Order
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
