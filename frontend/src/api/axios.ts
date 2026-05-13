import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Crucial for HttpOnly cookies
});

// No need to manually add Bearer token as it's handled by cookies now
API.interceptors.request.use((config) => {
  return config;
});

export default API;
