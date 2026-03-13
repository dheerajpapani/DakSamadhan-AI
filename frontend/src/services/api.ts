import axios from 'axios';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Attach real Supabase JWT to every request
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

// Complaint submission goes through FastAPI (for AI analysis)
export const complaintService = {
    submit: async (data: { subject: string; description: string; email: string; category?: string }) => {
        const response = await api.post('/complaints/', data);
        return response.data;
    },

    resolve: async (id: string, notes: string) => {
        const response = await api.patch(`/complaints/${id}/resolve`, { resolution_notes: notes });
        return response.data;
    },

    respond: async (id: string, text: string) => {
        const response = await api.post(`/complaints/${id}/respond?response_text=${encodeURIComponent(text)}`);
        return response.data;
    },
};
