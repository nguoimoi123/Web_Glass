import axios from 'axios';
import { toast } from 'sonner';
const API_URL = typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Allow cookies to be sent with requests
});
// Request interceptor for adding token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
// Response interceptor for handling errors
api.interceptors.response.use(response => {
  return response;
}, error => {
  const message = error.response?.data?.message || 'Something went wrong';
  // Handle authentication errors
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Only show toast if not on login page
    if (!window.location.pathname.includes('/login')) {
      toast.error('Session expired. Please login again.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  } else {
    // Show error message for other errors
    toast.error(message);
  }
  return Promise.reject(error);
});
export default api;