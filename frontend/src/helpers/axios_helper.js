import axios from 'axios';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? '/api'
    : 'https://docflow-sil8.onrender.com/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong';
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(new Error(msg));
  }
);

export default api;
