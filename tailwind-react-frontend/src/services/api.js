import axios from 'axios';

// Automatically include token for authenticated requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --------------------
// RESTAURANT SERVICE (port 5000)
// --------------------
export const restaurantAPI = axios.create({
  baseURL: 'http://localhost:5000/api',
});
restaurantAPI.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...getAuthHeaders() };
  return config;
});

// --------------------
// AUTH SERVICE (port 5001)
// --------------------
export const authAPI = axios.create({
  baseURL: 'http://localhost:5001/api/auth',
});

// --------------------
// ORDER SERVICE (port 5005)
// --------------------
const orderAPI = axios.create({
  baseURL: 'http://localhost:5005/api/orders',
});
orderAPI.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...getAuthHeaders() };
  return config;
});

// Create new order
export const placeOrder = async (order) => {
  const res = await orderAPI.post('/', order);
  return res.data;
};

// Get orders for current user
export const fetchMyOrders = async () => {
  const res = await orderAPI.get('/my-orders');
  return res.data;
};

// Update order status using fetch() on port 5005
export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`http://localhost:5005/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const deleteOrder = async (orderId) => {
  const res = await fetch(`http://localhost:5005/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.json();
};

export const editOrder = async (orderId, updatedData) => {
  const res = await fetch(`http://localhost:5005/api/orders/${orderId}/edit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(updatedData),
  });
  return res.json();
};
