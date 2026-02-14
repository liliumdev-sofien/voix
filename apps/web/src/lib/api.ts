import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    console.log('Attaching token to request:', config.url);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found in localStorage for request:', config.url);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access - redirecting to login');
      localStorage.removeItem('accessToken');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/studio/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
