import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error.response) return 'Unable to reach the server. Check that the API is running and try again.';
  return error.response.data?.message || fallback;
}

export default api;
