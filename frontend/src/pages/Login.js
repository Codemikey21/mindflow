import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Email o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="auth-left-content">
                    <div className="auth-brand">MindFlow</div>
                    <p className="auth-tagline">Tu plataforma inteligente para organizar, priorizar y tomar mejores decisiones.</p>
                    <div className="auth-features">
                        <div className="auth-feature-item">
                            <span>🎯</span>
                            <span>Priorización automática de tareas</span>
                        </div>
                        <div className="auth-feature-item">
                            <span>🧠</span>
                            <span>Motor de decisiones inteligente</span>
                        </div>
                        <div className="auth-feature-item">
                            <span>📊</span>
                            <span>Análisis de carga mental</span>
                        </div>
                        <div className="auth-feature-item">
                            <span>⚡</span>
                            <span>Recomendaciones diarias</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-box">
                    <h2>Bienvenido 👋</h2>
                    <p className="subtitle">Inicia sesión para continuar</p>
                    {error && <div className="error-msg">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Contraseña</label>
                            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                    <div className="auth-footer">
                        ¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;