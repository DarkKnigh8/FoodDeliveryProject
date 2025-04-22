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
// ORDER SERVICE (port 5002)
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

// Update order status by ID
export const updateOrderStatus = async (orderId, status) => {
  const res = await orderAPI.put(`/${orderId}/status`, { status });
  return res.data;
};




//  admin_service
const BASE_URL = 'http://localhost:5050/api/admin';

export const fetchAllRestaurants = async (token) => {
  console.log("Sending token:", token); // 🔍 Debug
  const res = await fetch(`${BASE_URL}/restaurants`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch restaurants');
  return await res.json();
};


export const verifyRestaurant = async (id, token) => {
  const res = await fetch(`${BASE_URL}/verify-restaurant/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to verify restaurant');
  return await res.json();
};

