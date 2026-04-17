import api from './api';

const taskService = {
    getTasks: async () => {
        const response = await api.get('/tasks/');
        return response.data;
    },

    createTask: async (taskData) => {
        const response = await api.post('/tasks/', taskData);
        return response.data;
    },

    updateTask: async (id, taskData) => {
        const response = await api.patch(`/tasks/${id}/`, taskData);
        return response.data;
    },

    deleteTask: async (id) => {
        await api.delete(`/tasks/${id}/`);
    },

    getPrioritized: async () => {
        const response = await api.get('/tasks/prioritized/');
        return response.data;
    },

    getDailySummary: async () => {
        const response = await api.get('/tasks/daily_summary/');
        return response.data;
    },
};

export default taskService;