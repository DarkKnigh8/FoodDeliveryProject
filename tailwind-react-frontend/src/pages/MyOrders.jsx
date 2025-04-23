import { useEffect, useState } from 'react';
import { fetchMyOrders, updateOrderStatus, deleteOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';
import EditOrderModal from '../components/EditOrderModal'; // Ensure correct path

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const navigate = useNavigate();

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchMyOrders();

    const sorted = Array.isArray(data)
      ? data
          .filter(order => order.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];

    setOrders(sorted);
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

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to delete this order?');
    if (!confirmed) return;

    await deleteOrder(orderId);
    loadOrders();
  };

  const handleTrack = (orderId) => {
    navigate(`/track/${orderId}`);
  };

  const handleSetDelivery = (orderId) => {
    alert(`Set delivery for order ${orderId}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onUpdated={loadOrders}
        />
      )}

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

            <div className="text-sm text-gray-500 mb-2">
              Placed on: {new Date(order.createdAt).toLocaleString()}
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
            <div className="flex gap-4 mt-4 flex-wrap">
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

              {(order.status === 'Pending' || order.status === 'Confirmed') && (
                <button
                  onClick={() => handleSetDelivery(order._id)}
                  className="px-4 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Set Delivery
                </button>
              )}

              {/* ✅ Edit Order Button */}
              <button
                onClick={() => setEditingOrder(order)}
                className="px-4 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
              >
                Edit Order
              </button>

              {/* ✅ Delete Order Button */}
              <button
                onClick={() => handleDelete(order._id)}
                className="px-4 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Delete Order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
