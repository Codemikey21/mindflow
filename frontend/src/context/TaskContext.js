import { createContext, useState, useContext } from 'react';
import taskService from '../services/taskService';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await taskService.getPrioritized();
            setTasks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const data = await taskService.getDailySummary();
            setSummary(data);
        } catch (error) {
            console.error(error);
        }
    };

    const createTask = async (taskData) => {
        const newTask = await taskService.createTask(taskData);
        setTasks(prev => [newTask, ...prev]);
        return newTask;
    };

    const updateTask = async (id, taskData) => {
        const updated = await taskService.updateTask(id, taskData);
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
        return updated;
    };

    const deleteTask = async (id) => {
        await taskService.deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    return (
        <TaskContext.Provider value={{ tasks, summary, loading, fetchTasks, fetchSummary, createTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => useContext(TaskContext);
export default TaskContext;