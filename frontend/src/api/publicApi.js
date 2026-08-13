import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const getPublicRecord = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/prescriptions/public/${token}/`);
    return response.data;
};