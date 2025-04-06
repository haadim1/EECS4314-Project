import axios from 'axios';

// Use environment variable if provided, otherwise use localhost
// if you are using the docker the http would be http://localhost:5000
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eecs4314-core-service-510709848798.us-central1.run.app';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Enhanced request interceptor
API.interceptors.request.use((config) => {
  // Try to get token from localStorage
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }
  return config;
});

// Add response interceptor to handle authentication errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Optional: Handle unauthorized errors (e.g., redirect to login)
      console.warn('Authentication error detected');
    }
    return Promise.reject(error);
  }
);

export default API;