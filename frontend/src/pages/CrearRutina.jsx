import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { crearRutina, crearEjercicio } from '../api/api';
import EjercicioForm from '../components/EjercicioForm';
import EjerciciosList from '../components/EjerciciosList';
import ErrorMessage from '../components/ErrorMessage';

const CrearRutina = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const duplicateData = location.state?.duplicateFrom;

    const [nombre, setNombre] = useState(duplicateData?.nombre || '');
    const [descripcion, setDescripcion] = useState(duplicateData?.descripcion || '');
    const [ejercicios, setEjercicios] = useState(duplicateData?.ejercicios || []);
    const [showEjercicioForm, setShowEjercicioForm] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleAddEjercicio = (ejercicioData) => {
        const newEjercicio = {
            ...ejercicioData,
            id: Date.now(), // Temporary ID for frontend
            orden: ejercicios.filter((e) => e.dia === ejercicioData.dia).length + 1,
        };
        setEjercicios([...ejercicios, newEjercicio]);
        setShowEjercicioForm(false);
    };

    const handleRemoveEjercicio = (id) => {
        setEjercicios(ejercicios.filter((e) => e.id !== id));
    };

    const handleReorder = (dia, newOrder) => {
        const updatedWithOrder = newOrder.map((ej, index) => ({
            ...ej,
            orden: index + 1
        }));

        setEjercicios(prevEjercicios => {
            const otherDays = prevEjercicios.filter(e => e.dia !== dia);
            return [...otherDays, ...updatedWithOrder];
        });
    };

    const groupEjerciciosByDia = () => {
        const grouped = {};
        ejercicios.forEach((ejercicio) => {
            if (!grouped[ejercicio.dia]) {
                grouped[ejercicio.dia] = [];
            }
            grouped[ejercicio.dia].push(ejercicio);
        });
        return grouped;
    };

    const validateForm = () => {
        const errors = {};

        if (!nombre.trim()) {
            errors.nombre = 'El nombre de la rutina es requerido';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // 1. Create the routine
            const rutinaCreada = await crearRutina({
                nombre,
                descripcion: descripcion || null,
            });

            // 2. Add all exercises
            const ejerciciosPromises = ejercicios.map((ejercicio) =>
                crearEjercicio({
                    rutina_id: rutinaCreada.id,
                    nombre: ejercicio.nombre,
                    dia: ejercicio.dia,
                    series: ejercicio.series,
                    repeticiones: ejercicio.repeticiones,
                    peso: ejercicio.peso,
                    notas: ejercicio.notas || null,
                    orden: ejercicio.orden,
                })
            );

            await Promise.all(ejerciciosPromises);

            // 3. Navigate to the detail page
            navigate(`/rutinas/${rutinaCreada.id}`);
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container fade-in">
            <Link to="/" className="btn btn-secondary btn-sm" style={{ marginBottom: 'var(--spacing-lg)' }}>
                ← Volver a Rutinas
            </Link>

            <div className="page-header">
                <h1 className="page-title">➕ Crear Nueva Rutina</h1>
                <p className="page-description">
                    Define tu rutina y agrega los ejercicios para cada día
                </p>
            </div>

            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleSubmit}>
                {/* Routine Basic Info */}
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>📝 Información de la Rutina</h3>

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre de la Rutina *</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => {
                                setNombre(e.target.value);
                                if (formErrors.nombre) {
                                    setFormErrors({ ...formErrors, nombre: undefined });
                                }
                            }}
                            placeholder="ej: Rutina Full Body, Push Pull Legs..."
                        />
                        {formErrors.nombre && <div className="form-error">{formErrors.nombre}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción (opcional)</label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows="3"
                            placeholder="Describe el objetivo de esta rutina..."
                        />
                    </div>
                </div>

                {/* Exercises Section */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                        <h2>🏋️ Ejercicios</h2>
                        {!showEjercicioForm && (
                            <button
                                type="button"
                                onClick={() => setShowEjercicioForm(true)}
                                className="btn btn-primary btn-sm"
                            >
                                ➕ Agregar Ejercicio
                            </button>
                        )}
                    </div>

                    {showEjercicioForm && (
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <EjercicioForm
                                onSubmit={handleAddEjercicio}
                                onCancel={() => setShowEjercicioForm(false)}
                            />
                        </div>
                    )}

                    {ejercicios.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">💪</div>
                            <p className="text-muted">
                                No has agregado ejercicios aún. Haz clic en "Agregar Ejercicio" para comenzar.
                            </p>
                        </div>
                    ) : (
                        <EjerciciosList
                            ejerciciosPorDia={groupEjerciciosByDia()}
                            editable={true}
                            onDelete={handleRemoveEjercicio}
                            onReorder={handleReorder}
                        />
                    )}
                </div>

                {/* Submit Buttons */}
                <div className="card" style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={isSubmitting}
                        style={{ flex: 1 }}
                    >
                        {isSubmitting ? '⏳ Creando...' : '💾 Crear Rutina'}
                    </button>
                    <Link to="/" className="btn btn-secondary btn-lg">
                        ✕ Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CrearRutina;
