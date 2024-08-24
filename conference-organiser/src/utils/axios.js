import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:2000', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

axiosInstance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
export default axiosInstance;
