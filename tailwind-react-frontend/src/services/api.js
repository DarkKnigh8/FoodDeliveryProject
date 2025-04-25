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


////serach function
const API_BASE_URL = 'http://localhost:5000/api/restaurants'; // Adjust if different

export const searchRestaurants = async (query, token) => {
  const response = await fetch(`${API_BASE_URL}/search?query=${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
};



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

//delivery service eke ewa mock
// src/services/api.js

// export const confirmCheckout = async (checkoutData) => {
//   const res = await fetch('http://localhost:5006/api/deliveries/checkout', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//     body: JSON.stringify(checkoutData),
//   });
//   return res.json();
// };

// export const fetchDeliveryDetails = async (deliveryId) => {
//   const res = await fetch(`http://localhost:5006/api/deliveries/${deliveryId}`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//   });
//   return res.json();
// };

// export const fetchOrderDetails = async (orderId) => {
//   const res = await fetch(`http://localhost:5005/api/orders/${orderId}`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     },
//   });
//   return res.json();
// };

// src/services/api.js

export const fetchOrderDetails = async (orderId) => {
  const res = await fetch(`http://localhost:5005/api/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const data = await res.json();
  console.log('Fetched Order Details:', data); // ✅ Debug log
  return data;
};

export const confirmCheckout = async (checkoutData) => {
  const res = await fetch('http://localhost:5006/api/deliveries/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(checkoutData),
  });
  const data = await res.json();
  console.log('Checkout Confirmation Response:', data); // ✅ Debug log
  return data;
};

export const fetchDeliveryDetails = async (deliveryId) => {
  const res = await fetch(`http://localhost:5006/api/deliveries/${deliveryId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const data = await res.json();
  return data;
};
