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

export const placeOrder = async (order) => {
  const res = await orderAPI.post('/', order);
  return res.data;
};

export const fetchMyOrders = async () => {
  const res = await orderAPI.get('/my-orders');
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await orderAPI.put(`/${orderId}/status`, { status });
  return res.data;
};

// --------------------
// ADMIN SERVICE (port 5050)
// --------------------
const adminAPI = axios.create({
  baseURL: 'http://localhost:5050/api/admin',
});
adminAPI.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...getAuthHeaders() };
  return config;
});

export const fetchAllRestaurants = async () => {
  const res = await adminAPI.get('/restaurants');
  return res.data;
};

export const verifyRestaurant = async (id) => {
  const res = await adminAPI.put(`/verify-restaurant/${id}`);
  return res.data;
};
