import axios from 'axios';

const api = axios.create({
  baseURL: '', // Using Vite proxy configured in vite.config.js
});

// Request interceptor to automatically add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      // If we are not already on login page, redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup') && !window.location.pathname.startsWith('/share')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
