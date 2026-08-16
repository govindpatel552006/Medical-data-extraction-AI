import axios from 'axios';

const API_BASE_URL = 'https://medical-data-extraction-ai-1.onrender.com/api';

export const getPublicRecord = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/prescriptions/public/${token}/`);
    return response.data;
};