import { useEffect, useState } from 'react';
import { restaurantAPI } from '../services/api';

export default function RestaurantOrders({ restaurantId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  const fetchOrders = () => {
    const token = localStorage.getItem('token');
    restaurantAPI
      .get(`/restaurants/${restaurantId}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log('Fetched orders:', res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err.response?.data || err.message);
      });
  };
  
  const updateStatus = (orderId, status) => {
    restaurantAPI
      .put(`/restaurants/orders/${orderId}/status`, { status })
      .then(() => fetchOrders())
      .catch((err) => console.error('Error updating status:', err));
  };

  if (!orders.length) return <p className="mt-2 text-sm text-gray-500">No orders found for this restaurant.</p>;

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Orders</h4>
      <ul className="space-y-2">
        {orders.map((order) => (
          <li key={order._id} className="border p-2 rounded">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> Rs:{order.totalPrice}</p>
            <p><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>

            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              className="mt-2 border rounded px-2 py-1"
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
