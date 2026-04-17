import api from './api';

const authService = {
    register: async (username, email, password) => {
        const response = await api.post('/auth/register/', { username, email, password });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login/', { email, password });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile/');
        return response.data;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },
};

export default authService;