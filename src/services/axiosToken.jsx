import axios from 'axios';

// Create an Axios instance with base URL and default headers
const axiosToken = axios.create({
  baseURL: import.meta.env.VITE_TOKEN_BASE_URL || 'https://ops-staging.niramayasoul.com/api/v1/', // Proxying the request
  headers: {
    'Content-Type': 'application/json', // Default header type
  },
});

// Request interceptor to attach the token to the Authorization header
axiosToken.interceptors.request.use(
  (config) => {
    // Retrieve the token from environment variables or local storage
    const accessToken = localStorage.getItem('token');
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Attach token to the Authorization header
    }
    return config;
  },
  (error) => {
    // Handle the request error here
    return Promise.reject(error);
  }
);

// Response interceptor (Optional: to handle responses globally, e.g., refreshing tokens)
axiosToken.interceptors.response.use(
  (response) => response, // Return the response directly if successful
  (error) => {
    // Handle the response error here, e.g., check for expired token, log out user, etc.
    return Promise.reject(error);
  }
);

export default axiosToken;
