import axios from 'axios';

import useAuthStore from '../Store/authStore';

const API_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://personal-finance-tracker-api-tcxh.onrender.com/api'
        : 'http://localhost:3000/api';


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default api;