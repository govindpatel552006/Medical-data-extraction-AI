import axiosInstance from './axiosInstance';

export const uploadPrescription = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/prescriptions/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getMyPrescriptions = async () => {
    const response = await axiosInstance.get('/prescriptions/my-records/');
    return response.data;
};

export const deletePrescription = async (id) => {
    await axiosInstance.delete(`/prescriptions/${id}/delete/`);
};

export const generateDietPlan = async (prescriptionId, force = false) => {
    const response = await axiosInstance.post(
        `/dietplan/generate/${prescriptionId}/${force ? '?force=true' : ''}`
    );
    return response.data;
};

export const getDietPlan = async (prescriptionId) => {
    const response = await axiosInstance.get(`/dietplan/${prescriptionId}/`);
    return response.data;
};