import { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
    const { tasks, fetchTasks, createTask, updateTask, deleteTask, loading } = useTask();
    const { logout } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', priority: 'medium', status: 'pending', deadline: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form };
        if (!data.deadline) delete data.deadline;
        await createTask(data);
        setShowForm(false);
        setForm({ title: '', description: '', priority: 'medium', status: 'pending', deadline: '' });
    };

    const handleStatus = async (task) => {
        const next = task.status === 'pending' ? 'in_progress' : task.status === 'in_progress' ? 'completed' : 'pending';
        await updateTask(task.id, { status: next });
    };

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <h1 className="logo">MindFlow</h1>
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/decisions">Decisiones</Link>
                    <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="page-header">
                    <h2>🗂️ Mis Tareas</h2>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'Cancelar' : '+ Nueva Tarea'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="task-form">
                        <input type="text" placeholder="Título" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                        <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
                        <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}>
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                            <option value="critical">Crítica</option>
                        </select>
                        <input type="datetime-local" value={form.deadline} onChange={(e) => setForm({...form, deadline: e.target.value})} />
                        <button type="submit" className="btn-primary">Crear Tarea</button>
                    </form>
                )}

                {loading ? <p>Cargando...</p> : (
                    <div className="tasks-list">
                        {tasks.map(task => (
                            <div key={task.id} className={`task-card ${task.status}`}>
                                <div className="task-header">
                                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                                    <span className="score">Score: {task.final_score.toFixed(1)}</span>
                                </div>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <div className="task-actions">
                                    <button onClick={() => handleStatus(task)} className="btn-status">{task.status}</button>
                                    <button onClick={() => deleteTask(task.id)} className="btn-danger">Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;