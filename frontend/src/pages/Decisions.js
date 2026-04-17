import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import decisionService from '../services/decisionService';
import Avatar from '../components/Avatar';

const Decisions = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [decisions, setDecisions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: '', description: '' });
    const [options, setOptions] = useState([
        { name: '', weight: 1, impact: 5, risk: 3 },
        { name: '', weight: 1, impact: 5, risk: 3 },
    ]);

    useEffect(() => { fetchDecisions(); }, []);

    const fetchDecisions = async () => {
        setLoading(true);
        try {
            const data = await decisionService.getDecisions();
            setDecisions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const addOption = () => {
        setOptions([...options, { name: '', weight: 1, impact: 5, risk: 3 }]);
    };

    const updateOption = (index, field, value) => {
        const updated = [...options];
        updated[index][field] = field === 'name' ? value : parseFloat(value);
        setOptions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await decisionService.createDecision({ ...form, options });
            setDecisions([data, ...decisions]);
            setShowForm(false);
            setForm({ title: '', description: '' });
            setOptions([
                { name: '', weight: 1, impact: 5, risk: 3 },
                { name: '', weight: 1, impact: 5, risk: 3 },
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        await decisionService.deleteDecision(id);
        setDecisions(decisions.filter(d => d.id !== id));
    };

    const getMaxScore = (options) => {
        return Math.max(...options.map(o => o.final_score), 1);
    };

    const getScorePercentage = (score, maxScore) => {
        return Math.max((score / maxScore) * 100, 5).toFixed(0);
    };

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">MindFlow</div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="sidebar-item">
                        <span className="icon">🏠</span> Dashboard
                    </Link>
                    <Link to="/tasks" className="sidebar-item">
                        <span className="icon">📋</span> Tareas
                    </Link>
                    <Link to="/decisions" className="sidebar-item active">
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
                        <h2>🧠 Motor de Decisiones</h2>
                        <p className="page-subtitle">Evalúa opciones con criterios inteligentes y obtén recomendaciones</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'Cancelar' : '+ Nueva Decisión'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="task-form">
                        <input type="text" placeholder="¿Qué decisión necesitas tomar?" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                        <textarea placeholder="Describe el contexto de la decisión" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Opciones a evaluar</h3>
                        {options.map((opt, i) => (
                            <div key={i} className="option-row">
                                <input type="text" placeholder={`Opción ${i + 1}`} value={opt.name} onChange={(e) => updateOption(i, 'name', e.target.value)} required />
                                <label>Peso (1-10)
                                    <input type="number" min="1" max="10" value={opt.weight} onChange={(e) => updateOption(i, 'weight', e.target.value)} />
                                </label>
                                <label>Impacto (1-10)
                                    <input type="number" min="1" max="10" value={opt.impact} onChange={(e) => updateOption(i, 'impact', e.target.value)} />
                                </label>
                                <label>Riesgo (1-10)
                                    <input type="number" min="1" max="10" value={opt.risk} onChange={(e) => updateOption(i, 'risk', e.target.value)} />
                                </label>
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" onClick={addOption} className="btn-secondary">+ Agregar Opción</button>
                            <button type="submit" className="btn-primary">⚡ Evaluar Decisión</button>
                        </div>
                    </form>
                )}

                {loading ? <p style={{ color: 'var(--text-muted)' }}>Cargando...</p> : (
                    <div className="tasks-list">
                        {decisions.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤔</div>
                                <p>No hay decisiones aún. ¡Evalúa tu primera decisión!</p>
                            </div>
                        )}
                        {decisions.map(decision => (
                            <div key={decision.id} className="task-card">
                                <h3>{decision.title}</h3>
                                {decision.description && <p>{decision.description}</p>}

                                <div className="recommendation">
                                    <strong>💡 Recomendación del sistema</strong>
                                    <p>{decision.recommendation}</p>
                                </div>

                                <div className="options-results">
                                    {decision.options
                                        .sort((a, b) => b.final_score - a.final_score)
                                        .map(opt => {
                                            const maxScore = getMaxScore(decision.options);
                                            const pct = getScorePercentage(opt.final_score, maxScore);
                                            return (
                                                <div key={opt.id} className="option-result">
                                                    <div className="option-result-header">
                                                        <span>{opt.name}</span>
                                                        <span className="option-score-label">{pct}%</span>
                                                    </div>
                                                    <div className="score-bar-container">
                                                        <div className="score-bar" style={{ width: `${pct}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                <button onClick={() => handleDelete(decision.id)} className="btn-danger">
                                    🗑️ Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Avatar />
        </div>
    );
};

export default Decisions;