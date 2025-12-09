import { Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import './App.css';
import Rutinas from './pages/Rutinas';
import DetalleRutina from './pages/DetalleRutina';
import CrearRutina from './pages/CrearRutina';
import EditarRutina from './pages/EditarRutina';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="app-container">
      {/* Header Navigation */}
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="app-logo">
            <span className="logo-icon">💪</span>
            <h1 className="logo-text">GymRoutines</h1>
          </Link>

          <nav className="header-nav">
            {user ? (
              <>
                <Link to="/" className="btn btn-secondary btn-sm">
                  📋 Mis Rutinas
                </Link>
                <Link to="/rutinas/nueva" className="btn btn-primary btn-sm">
                  ➕ Nueva Rutina
                </Link>
                <button onClick={logout} className="btn btn-danger btn-sm" style={{ marginLeft: '10px' }}>
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-primary btn-sm">Ingresar</Link>
                <Link to="/register" className="btn btn-secondary btn-sm" style={{ marginLeft: '10px' }}>Registrarse</Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Rutinas />
            </PrivateRoute>
          } />
          <Route path="/rutinas/nueva" element={
            <PrivateRoute>
              <CrearRutina />
            </PrivateRoute>
          } />
          <Route path="/rutinas/:id" element={
            <PrivateRoute>
              <DetalleRutina />
            </PrivateRoute>
          } />
          <Route path="/rutinas/:id/editar" element={
            <PrivateRoute>
              <EditarRutina />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
