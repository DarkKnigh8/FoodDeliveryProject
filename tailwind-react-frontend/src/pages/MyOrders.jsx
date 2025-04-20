import { useEffect, useState } from 'react';
import { fetchMyOrders } from '../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchMyOrders();
      setOrders(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to load orders: ' + err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && orders.length === 0 && (
        <p>No orders found.</p>
      )}

      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded shadow mb-4">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> Rs. {order.totalPrice}</p>
          <ul className="list-disc ml-5">
            {order.items.map((item, index) => (
              <li key={index}>{item.name} × {item.quantity} = Rs. {item.price * item.quantity}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
