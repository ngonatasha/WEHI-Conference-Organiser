import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://115.146.87.152:2000', 
  timeout: 10000, 
});


export default axiosInstance;
