import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const tips = {
    '/dashboard': [
        '📅 Revisa tu calendario para no perderte ningún deadline.',
        '⚠️ Si tienes más de 10 tareas activas estás en sobrecarga.',
        '🎯 Enfócate primero en las tareas con mayor score.',
    ],
    '/tasks': [
        '🔥 Las tareas críticas tienen prioridad automática máxima.',
        '⏰ Agrega deadlines para mejorar el score de urgencia.',
        '✅ Cambia el estado de tus tareas para trackear progreso.',
    ],
    '/decisions': [
        '🧠 Un impacto alto y riesgo bajo = mejor decisión.',
        '⚖️ Usa el peso para indicar qué criterio importa más.',
        '📊 El score final combina impacto y riesgo automáticamente.',
    ],
};

const Avatar = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const currentTips = tips[location.pathname] || tips['/dashboard'];

    return (
        <div className="avatar-widget">
            {open && (
                <div className="avatar-panel">
                    <div className="avatar-header">
                        <span className="avatar-icon">🤖</span>
                        <div>
                            <h4>Asistente MindFlow</h4>
                            <p>Tips para esta sección</p>
                        </div>
                    </div>
                    <div className="avatar-tips">
                        {currentTips.map((tip, i) => (
                            <div key={i} className="avatar-tip">{tip}</div>
                        ))}
                    </div>
                </div>
            )}
            <button className="avatar-btn" onClick={() => setOpen(!open)}>
                {open ? '✕' : '🤖'}
            </button>
        </div>
    );
};

export default Avatar;