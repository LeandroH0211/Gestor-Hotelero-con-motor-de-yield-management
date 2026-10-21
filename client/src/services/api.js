import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true //enviar y recibir los Refresh Tokens en cookies
});

export default api;