import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Asegúrate que coincida con el puerto de tu backend
    withCredentials: true, // Vital para enviar y recibir cookies HttpOnly
    headers: {
        'Content-Type': 'application/json'
    }
});

// Bandera para evitar bucles infinitos en el reintento de refresh token
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

// Interceptor de Respuestas (Manejo de 401 y Refresh Token automático)
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Si el error es 401 y no hemos intentado refrescar aún en esta petición
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Si ya se está refrescando, encolamos la petición hasta que termine
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Llamada al endpoint del backend para renovar las cookies de acceso
                await axios.post('http://localhost:3000/api/auth/refresh', {}, {
                    withCredentials: true
                });

                isRefreshing = false;
                processQueue(null, null);

                // Reintentamos la petición original que falló
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError, null);
                
                // Si el refresh token también expiró, forzamos cierre de sesión o redirección al login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);