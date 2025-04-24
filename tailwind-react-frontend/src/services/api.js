import axios from 'axios';

// Restaurant service (usually on port 5000)
export const restaurantAPI = axios.create({
  baseURL: 'http://localhost:5000/api',
});

restaurantAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth service (usually on port 5001)
export const authAPI = axios.create({
  baseURL: 'http://localhost:5001/api/auth',
});



// Delivery service (usually on port 5003)
export const deliveryAPI = axios.create({
  baseURL: 'http://localhost:5003/api',
});

deliveryAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
