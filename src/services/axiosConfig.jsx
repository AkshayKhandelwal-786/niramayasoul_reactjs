import axios from 'axios';

// Create an Axios instance with base URL and default headers
const axiosConfig = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://ops-staging.niramayasoul.com/web/v1/', // Proxying the request
  headers: {
    'Content-Type': 'application/json', // Default header type
  },
});

// Request interceptor (Token logic removed as it's not needed)
axiosConfig.interceptors.request.use(
  (config) => {
    // You can modify or log the request config here if needed, but no token is attached
    return config;
  },
  (error) => {
    // Handle the request error here
    return Promise.reject(error);
  }
);

// Response interceptor (Optional: to handle responses globally)
axiosConfig.interceptors.response.use(
  (response) => response, // Return the response directly if successful
  (error) => {
    // Handle the response error here
    return Promise.reject(error);
  }
);

export default axiosConfig;
