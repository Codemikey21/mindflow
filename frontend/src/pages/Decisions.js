import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import decisionService from '../services/decisionService';

const Decisions = () => {
    const { logout } = useAuth();
    const [decisions, setDecisions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: '', description: '' });
    const [options, setOptions] = useState([
        { name: '', weight: 1, impact: 5, risk: 3 },
        { name: '', weight: 1, impact: 5, risk: 3 },
    ]);

    useEffect(() => {
        fetchDecisions();
    }, []);

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

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <h1 className="logo">MindFlow</h1>
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/tasks">Tareas</Link>
                    <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="page-header">
                    <h2>🧠 Motor de Decisiones</h2>
                    <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                        {showForm ? 'Cancelar' : '+ Nueva Decisión'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="task-form">
                        <input type="text" placeholder="Título de la decisión" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                        <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
                        <h3>Opciones</h3>
                        {options.map((opt, i) => (
                            <div key={i} className="option-row">
                                <input type="text" placeholder={`Opción ${i + 1}`} value={opt.name} onChange={(e) => updateOption(i, 'name', e.target.value)} required />
                                <label>Peso <input type="number" min="1" max="10" value={opt.weight} onChange={(e) => updateOption(i, 'weight', e.target.value)} /></label>
                                <label>Impacto <input type="number" min="1" max="10" value={opt.impact} onChange={(e) => updateOption(i, 'impact', e.target.value)} /></label>
                                <label>Riesgo <input type="number" min="1" max="10" value={opt.risk} onChange={(e) => updateOption(i, 'risk', e.target.value)} /></label>
                            </div>
                        ))}
                        <button type="button" onClick={addOption} className="btn-secondary">+ Agregar Opción</button>
                        <button type="submit" className="btn-primary">Evaluar Decisión</button>
                    </form>
                )}

                {loading ? <p>Cargando...</p> : (
                    <div className="tasks-list">
                        {decisions.map(decision => (
                            <div key={decision.id} className="task-card">
                                <h3>{decision.title}</h3>
                                <p>{decision.description}</p>
                                <div className="recommendation">
                                    <strong>💡 Recomendación:</strong>
                                    <p>{decision.recommendation}</p>
                                </div>
                                <div className="options-list">
                                    {decision.options.map(opt => (
                                        <div key={opt.id} className="option-result">
                                            <span>{opt.name}</span>
                                            <span className="score">Score: {opt.final_score}</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => handleDelete(decision.id)} className="btn-danger">Eliminar</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Decisions;