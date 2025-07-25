import axios from 'axios';
const baseURL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
    baseURL,
    timeout: 60000,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        if (import.meta.env.DEV) {
            console.log('[API Request]', config.method.toUpperCase(), config.url, config.data || '');
        }

        const token = localStorage.getItem('token');
        if (token) {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log('[API Response]', response.status, response.config.url, response.data);
        }

        return response;
    },
    (error) => {
        if (error.response) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    },
);