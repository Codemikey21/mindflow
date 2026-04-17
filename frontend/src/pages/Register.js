import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(username, email, password);
            navigate('/login');
        } catch (err) {
            setError('Error al registrarse. Verifica los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="auth-left-content">
                    <div className="auth-brand">MindFlow</div>
                    <p className="auth-tagline">Únete y empieza a tomar el control de tu tiempo y decisiones.</p>
                    <div className="auth-features">
                        <div className="auth-feature-item">
                            <span>🚀</span>
                            <span>Configura tu perfil en segundos</span>
                        </div>
                        <div className="auth-feature-item">
                            <span>🔒</span>
                            <span>Tus datos seguros con JWT</span>
                        </div>
                        <div className="auth-feature-item">
                            <span>📅</span>
                            <span>Calendario integrado con alertas</span>
                        </div>
                        <div className="auth-feature-item">
                            <span>🤖</span>
                            <span>Asistente inteligente incluido</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-box">
                    <h2>Crear cuenta</h2>
                    <p className="subtitle">Comienza tu experiencia con MindFlow</p>
                    {error && <div className="error-msg">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Usuario</label>
                            <input type="text" placeholder="tunombre" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Contraseña</label>
                            <input type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Registrarse'}
                        </button>
                    </form>
                    <div className="auth-footer">
                        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;