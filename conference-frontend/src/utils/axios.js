import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://115.146.86.214:443', 
  timeout: 10000, 
});


export default axiosInstance;
