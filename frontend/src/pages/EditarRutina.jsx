import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    getRutinaDetalle,
    actualizarRutina,
    crearEjercicio,
    actualizarEjercicio,
    eliminarEjercicio,
} from '../api/api';
import EjercicioForm from '../components/EjercicioForm';
import EjerciciosList from '../components/EjerciciosList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EditarRutina = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [ejercicios, setEjercicios] = useState([]);
    const [ejerciciosOriginales, setEjerciciosOriginales] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [showEjercicioForm, setShowEjercicioForm] = useState(false);
    const [editingEjercicio, setEditingEjercicio] = useState(null);

    useEffect(() => {
        fetchRutina();
    }, [id]);

    const fetchRutina = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getRutinaDetalle(id);
            setNombre(data.nombre);
            setDescripcion(data.descripcion || '');

            // Flatten exercises from grouped by day
            const allEjercicios = [];
            Object.entries(data.ejercicios_por_dia).forEach(([dia, ejerciciosDia]) => {
                ejerciciosDia.forEach((ej) => {
                    allEjercicios.push({ ...ej, dia });
                });
            });

            setEjercicios(allEjercicios);
            setEjerciciosOriginales(allEjercicios);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

    const handleAddEjercicio = (ejercicioData) => {
        const newEjercicio = {
            ...ejercicioData,
            id: `new-${Date.now()}`, // Temporary ID for new exercises
            isNew: true,
            orden: ejercicios.filter((e) => e.dia === ejercicioData.dia).length + 1,
        };
        setEjercicios([...ejercicios, newEjercicio]);
        setShowEjercicioForm(false);
    };

    const handleEditEjercicio = (ejercicioData) => {
        setEjercicios(
            ejercicios.map((e) =>
                e.id === editingEjercicio.id ? { ...e, ...ejercicioData } : e
            )
        );
        setEditingEjercicio(null);
        setShowEjercicioForm(false);
    };

    const handleDeleteEjercicio = (ejercicioId) => {
        setEjercicios(ejercicios.filter((e) => e.id !== ejercicioId));
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

    const handleStartEdit = (ejercicio) => {
        setEditingEjercicio(ejercicio);
        setShowEjercicioForm(true);
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

            // 1. Update routine basic info
            await actualizarRutina(id, {
                nombre,
                descripcion: descripcion || null,
            });

            // 2. Handle exercises changes
            const ejerciciosOriginalesIds = new Set(ejerciciosOriginales.map((e) => e.id));
            const ejerciciosActualesIds = new Set(ejercicios.map((e) => e.id));

            // Delete removed exercises
            const ejerciciosEliminados = ejerciciosOriginales.filter(
                (e) => !ejerciciosActualesIds.has(e.id)
            );
            for (const ejercicio of ejerciciosEliminados) {
                await eliminarEjercicio(ejercicio.id);
            }

            // Create new exercises and update existing ones
            for (const ejercicio of ejercicios) {
                if (ejercicio.isNew) {
                    // Create new exercise
                    await crearEjercicio({
                        rutina_id: parseInt(id),
                        nombre: ejercicio.nombre,
                        dia: ejercicio.dia,
                        series: ejercicio.series,
                        repeticiones: ejercicio.repeticiones,
                        peso: ejercicio.peso,
                        notas: ejercicio.notas || null,
                        orden: ejercicio.orden,
                    });
                } else if (ejerciciosOriginalesIds.has(ejercicio.id)) {
                    // Update existing exercise
                    const original = ejerciciosOriginales.find((e) => e.id === ejercicio.id);
                    // Only update if changed
                    if (JSON.stringify(original) !== JSON.stringify(ejercicio)) {
                        await actualizarEjercicio(ejercicio.id, {
                            nombre: ejercicio.nombre,
                            dia: ejercicio.dia,
                            series: ejercicio.series,
                            repeticiones: ejercicio.repeticiones,
                            peso: ejercicio.peso,
                            notas: ejercicio.notas || null,
                            orden: ejercicio.orden,
                        });
                    }
                }
            }

            // 3. Navigate to detail page
            navigate(`/rutinas/${id}`);
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Cargando rutina..." />;
    }

    if (error && !nombre) {
        return (
            <div className="page-container">
                <ErrorMessage message={error} onRetry={fetchRutina} />
                <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
                    <Link to="/" className="btn btn-secondary">
                        ← Volver a Rutinas
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container fade-in">
            <Link to={`/rutinas/${id}`} className="btn btn-secondary btn-sm" style={{ marginBottom: 'var(--spacing-lg)' }}>
                ← Volver al Detalle
            </Link>

            <div className="page-header">
                <h1 className="page-title">✏️ Editar Rutina</h1>
                <p className="page-description">
                    Modifica la información y ejercicios de tu rutina
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
                                onClick={() => {
                                    setEditingEjercicio(null);
                                    setShowEjercicioForm(true);
                                }}
                                className="btn btn-primary btn-sm"
                            >
                                ➕ Agregar Ejercicio
                            </button>
                        )}
                    </div>

                    {showEjercicioForm && (
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <EjercicioForm
                                initialData={editingEjercicio}
                                onSubmit={editingEjercicio ? handleEditEjercicio : handleAddEjercicio}
                                onCancel={() => {
                                    setShowEjercicioForm(false);
                                    setEditingEjercicio(null);
                                }}
                            />
                        </div>
                    )}

                    {ejercicios.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">💪</div>
                            <p className="text-muted">
                                No hay ejercicios en esta rutina. Haz clic en "Agregar Ejercicio" para comenzar.
                            </p>
                        </div>
                    ) : (
                        <EjerciciosList
                            ejerciciosPorDia={groupEjerciciosByDia()}
                            editable={true}
                            onEdit={handleStartEdit}
                            onDelete={handleDeleteEjercicio}
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
                        {isSubmitting ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                    </button>
                    <Link to={`/rutinas/${id}`} className="btn btn-secondary btn-lg">
                        ✕ Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditarRutina;
