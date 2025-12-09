import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/api';
import './Auth.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(username, password);
            navigate('/login');
        } catch (err) {
            setError('Error al registrar usuario. Puede que el nombre ya exista.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Registro</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Registrarse</button>
            </form>
            <p>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
