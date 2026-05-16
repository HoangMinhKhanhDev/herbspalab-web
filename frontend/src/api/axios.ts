import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Crucial for HttpOnly cookies
});

// No need to manually add Bearer token as it's handled by cookies now
API.interceptors.request.use((config) => {
  return config;
});

API.interceptors.response.use(
  (response) => {
    // Prevent HTML from being processed as data (happens when Node is down and Apache serves index.html for API routes)
    const contentType = response.headers['content-type'] as string | undefined;
    if (contentType && typeof contentType === 'string' && contentType.includes('text/html')) {
      return Promise.reject(new Error('Server error: API returned HTML instead of JSON. Ensure Node.js server is running.'));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(error);
  }
);

export default API;
