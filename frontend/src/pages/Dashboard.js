import { useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { summary, fetchSummary, loading } = useTask();
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchSummary();
    }, []);

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <h1 className="logo">MindFlow</h1>
                <div className="nav-links">
                    <Link to="/tasks">Tareas</Link>
                    <Link to="/decisions">Decisiones</Link>
                    <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <h2>Bienvenido, {user?.username} 👋</h2>

                {loading ? <p>Cargando...</p> : summary && (
                    <div className="summary-grid">
                        <div className="summary-card">
                            <h3>Tareas Activas</h3>
                            <p className="summary-number">{summary.active_tasks}</p>
                        </div>
                        <div className="summary-card">
                            <h3>Completadas Hoy</h3>
                            <p className="summary-number">{summary.completed_today}</p>
                        </div>
                        <div className={`summary-card ${summary.overloaded ? 'overloaded' : 'ok'}`}>
                            <h3>Estado Mental</h3>
                            <p className="summary-number">{summary.overloaded ? '⚠️ Sobrecargado' : '✅ Balanceado'}</p>
                        </div>

                        <div className="top-tasks">
                            <h3>🎯 Top Prioridades del Día</h3>
                            {summary.top_priority_tasks.map(task => (
                                <div key={task.id} className="task-preview">
                                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                                    <span>{task.title}</span>
                                    <span className="score">Score: {task.final_score.toFixed(1)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;