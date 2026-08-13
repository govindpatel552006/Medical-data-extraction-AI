import axiosInstance from './axiosInstance';

export const getProfile = async () => {
    const response = await axiosInstance.get('/accounts/profile/');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await axiosInstance.put('/accounts/profile/', data);
    return response.data;
};