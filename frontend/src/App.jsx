import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Rutinas from './pages/Rutinas';
import DetalleRutina from './pages/DetalleRutina';
import CrearRutina from './pages/CrearRutina';
import EditarRutina from './pages/EditarRutina';

function App() {
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
            <Link to="/" className="btn btn-secondary btn-sm">
              📋 Mis Rutinas
            </Link>
            <Link to="/rutinas/nueva" className="btn btn-primary btn-sm">
              ➕ Nueva Rutina
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Rutinas />} />
          <Route path="/rutinas/nueva" element={<CrearRutina />} />
          <Route path="/rutinas/:id" element={<DetalleRutina />} />
          <Route path="/rutinas/:id/editar" element={<EditarRutina />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
