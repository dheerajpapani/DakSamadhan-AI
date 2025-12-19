import axios from 'axios';
import { supabase } from './supabase';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add Auth Token to Requests
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
        // For MVP/Dev without real auth
        config.headers.Authorization = 'Bearer mock-token';
    }
    return config;
});

export const complaintService = {
    submit: async (data: { subject: string; description: string; category?: string }) => {
        const response = await api.post('/complaints/', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/complaints/');
        return response.data;
    }
};
