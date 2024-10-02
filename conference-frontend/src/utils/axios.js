import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://api', 
  timeout: 10000, 
});


export default axiosInstance;
