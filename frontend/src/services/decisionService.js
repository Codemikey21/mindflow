import api from './api';

const decisionService = {
    getDecisions: async () => {
        const response = await api.get('/decisions/');
        return response.data;
    },

    createDecision: async (decisionData) => {
        const response = await api.post('/decisions/', decisionData);
        return response.data;
    },

    getDecision: async (id) => {
        const response = await api.get(`/decisions/${id}/`);
        return response.data;
    },

    deleteDecision: async (id) => {
        await api.delete(`/decisions/${id}/`);
    },
};

export default decisionService;