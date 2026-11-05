import axios from 'axios';
import authMemory from './authMemory'; //Importa el gestor en memoria

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true // Enviar y recibir los Refresh Tokens en cookies
});

// Interceptor para inyectar el token en cada petición leyendo de la memoria
api.interceptors.request.use(
  (config) => {
    const token = authMemory.getToken(); //Lee de memoria viva en lugar de localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;