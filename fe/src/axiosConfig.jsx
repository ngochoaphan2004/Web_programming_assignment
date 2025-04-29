import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_BE_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// ✅ Add a request interceptor
// axiosConfig.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default axiosConfig;
