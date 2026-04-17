import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Decisions from './pages/Decisions';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <TaskProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
                        <Route path="/decisions" element={<PrivateRoute><Decisions /></PrivateRoute>} />
                    </Routes>
                </TaskProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;