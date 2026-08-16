import axios from 'axios';

const API_BASE_URL = 'https://medical-data-extraction-ai-1.onrender.com';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Attach access token to every request automatically
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;