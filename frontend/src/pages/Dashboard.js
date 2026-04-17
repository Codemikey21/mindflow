import { useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';

const Dashboard = () => {
    const { summary, fetchSummary, tasks, fetchTasks, loading } = useTask();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSummary();
        fetchTasks();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getAlerts = () => {
        const alerts = [];
        if (!tasks.length) return [{ type: 'success', msg: '✅ Todo bajo control. ¡Buen trabajo!' }];
        tasks.forEach(task => {
            if (!task.deadline || task.status === 'completed') return;
            const diff = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            if (diff < 0) alerts.push({ type: 'danger', msg: `⛔ "${task.title}" está vencida` });
            else if (diff === 0) alerts.push({ type: 'danger', msg: `🔥 "${task.title}" vence hoy` });
            else if (diff <= 2) alerts.push({ type: 'warning', msg: `⚠️ "${task.title}" vence en ${diff} día(s)` });
        });
        if (summary?.overloaded) alerts.push({ type: 'warning', msg: '🧠 Tienes sobrecarga mental. Considera delegar tareas.' });
        if (!alerts.length) alerts.push({ type: 'success', msg: '✅ Todo bajo control. ¡Buen trabajo!' });
        return alerts.slice(0, 4);
    };

    const recentActivity = tasks.slice(0, 4).map(t => ({
        type: 'task',
        text: t.title,
        time: t.status
    }));

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">MindFlow</div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="sidebar-item active">
                        <span className="icon">🏠</span> Dashboard
                    </Link>
                    <Link to="/tasks" className="sidebar-item">
                        <span className="icon">📋</span> Tareas
                    </Link>
                    <Link to="/decisions" className="sidebar-item">
                        <span className="icon">🧠</span> Decisiones
                    </Link>
                </nav>
                <div className="sidebar-bottom">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="sidebar-username">{user?.username}</div>
                            <div className="sidebar-email">{user?.email}</div>
                        </div>
                    </div>
                    <button className="sidebar-item" onClick={handleLogout}>
                        <span className="icon">🚪</span> Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h2>Dashboard</h2>
                        <p className="page-subtitle">Bienvenido de vuelta, {user?.username} 👋</p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon purple">📋</div>
                        <div className="stat-info">
                            <h3>Tareas Activas</h3>
                            <div className="stat-number purple">{summary?.active_tasks ?? 0}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green">✅</div>
                        <div className="stat-info">
                            <h3>Completadas Hoy</h3>
                            <div className="stat-number green">{summary?.completed_today ?? 0}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className={`stat-icon ${summary?.overloaded ? 'red' : 'cyan'}`}>
                            {summary?.overloaded ? '⚠️' : '🧠'}
                        </div>
                        <div className="stat-info">
                            <h3>Estado Mental</h3>
                            <div className={`stat-number ${summary?.overloaded ? 'red' : 'cyan'}`}>
                                {summary?.overloaded ? 'Sobrecarga' : 'Balanceado'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>📅 Deadlines Próximos</h3>
                        <div className="activity-list">
                            {tasks.filter(t => t.deadline && t.status !== 'completed')
                                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                                .slice(0, 5)
                                .map(task => {
                                    const diff = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                                    return (
                                        <div key={task.id} className="activity-item">
                                            <div className={`activity-dot ${diff <= 1 ? 'decision' : 'task'}`}></div>
                                            <span>{task.title}</span>
                                            <span className="activity-time">
                                                {diff < 0 ? '⛔ Vencida' : diff === 0 ? '🔥 Hoy' : `📅 ${diff}d`}
                                            </span>
                                        </div>
                                    );
                                })}
                            {tasks.filter(t => t.deadline && t.status !== 'completed').length === 0 && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No hay deadlines próximos</p>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="dashboard-card">
                            <h3>🔔 Alertas</h3>
                            <div className="alerts-list">
                                {getAlerts().map((alert, i) => (
                                    <div key={i} className={`alert-item ${alert.type}`}>
                                        {alert.msg}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <h3>⚡ Actividad Reciente</h3>
                            <div className="activity-list">
                                {recentActivity.length ? recentActivity.map((item, i) => (
                                    <div key={i} className="activity-item">
                                        <div className="activity-dot task"></div>
                                        <span>{item.text}</span>
                                        <span className="activity-time">{item.time}</span>
                                    </div>
                                )) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No hay actividad reciente</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {summary?.top_priority_tasks?.length > 0 && (
                    <div className="dashboard-card" style={{ marginTop: '20px' }}>
                        <h3>🎯 Top Prioridades del Día</h3>
                        <div className="tasks-list" style={{ marginTop: '16px' }}>
                            {summary.top_priority_tasks.map(task => (
                                <div key={task.id} className="task-card">
                                    <div className="task-header">
                                        <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                                        <span className="score">⚡ Score: {task.final_score.toFixed(1)}</span>
                                    </div>
                                    <h3>{task.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Avatar />
        </div>
    );
};

export default Dashboard;