
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/pdf';

export const api = {
    compress: async (formData, onUploadProgress) => {
        return axios.post(`${API_URL}/compress`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress
        });
    },
    merge: async (formData) => {
        return axios.post(`${API_URL}/merge`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    split: async (formData) => {
        return axios.post(`${API_URL}/split`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    split: async (formData) => {
        return axios.post(`${API_URL}/split`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    // Add other endpoints as needed
};
