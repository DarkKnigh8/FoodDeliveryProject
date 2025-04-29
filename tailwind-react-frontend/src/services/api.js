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

// Search function
const API_BASE_URL = 'http://localhost:5000/api/restaurants'; 
export const searchRestaurants = async (query) => {
  const response = await fetch(`${API_BASE_URL}/search?query=${query}`, {
    headers: getAuthHeaders(),
  });
  return await response.json();
};

// --------------------
// AUTH SERVICE (port 5001)
// --------------------
export const authAPI = axios.create({
  baseURL: 'http://localhost:5001/api/auth',
});

// --------------------
// DELIVERY SERVICE (port 5003)
// --------------------
export const deliveryAPI = axios.create({
  baseURL: 'http://localhost:5006/api',
});
deliveryAPI.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...getAuthHeaders() };
  return config;
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

export const fetchOrderDetails = async (orderId) => {
  const res = await orderAPI.get(`/${orderId}`);
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

export const deleteOrder = async (orderId) => {
  const res = await fetch(`http://localhost:5005/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const editOrder = async (orderId, updatedData) => {
  const res = await fetch(`http://localhost:5005/api/orders/${orderId}/edit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(updatedData),
  });
  return res.json();
};

// --------------------
// DELIVERY SERVICE EXTRAS (port 5006)
// --------------------
export const confirmCheckout = async (checkoutData) => {
  const res = await fetch('http://localhost:5006/api/deliveries/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(checkoutData),
  });
  return await res.json();
};

export const fetchDeliveryDetails = async (deliveryId) => {
  const res = await fetch(`http://localhost:5006/api/deliveries/${deliveryId}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data;
};

// Admin transactions
const BASE_ADMIN_URL = 'http://localhost:5050/api/admin';

export const fetchAllTransactions = async () => {
  const res = await fetch(`${BASE_ADMIN_URL}/payments/transactions`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};

export const fetchFilteredTransactions = async (filters) => {
  const queryParams = new URLSearchParams(filters).toString();
  const res = await fetch(`${BASE_ADMIN_URL}/payments/transactions/filter?${queryParams}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
};
