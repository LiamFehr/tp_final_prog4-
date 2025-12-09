import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    getRutinaDetalle,
    eliminarRutina,
    actualizarEjercicio,
    eliminarEjercicio
} from '../api/api';
import EjerciciosList from '../components/EjerciciosList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EditarEjercicio from '../components/EditarEjercicio';
import CalendarioSemanal from '../components/CalendarioSemanal';
import { exportRutinaToPDF } from '../utils/pdfExport';

const DetalleRutina = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rutina, setRutina] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Delete Confirmation State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit Exercise State
    const [editingEjercicio, setEditingEjercicio] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // View Mode State: 'list' | 'calendar'
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        fetchRutina();
    }, [id]);

    const fetchRutina = async () => {
        try {
            setLoading(true);
            // Don't clear error if we are just refreshing data
            const data = await getRutinaDetalle(id);
            setRutina(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!showDeleteConfirm) {
            setShowDeleteConfirm(true);
            return;
        }

        try {
            setIsDeleting(true);
            await eliminarRutina(id);
            navigate('/');
        } catch (err) {
            setError(err.message);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    // --- Exercise Actions ---

    const handleEditClick = (ejercicio) => {
        setEditingEjercicio(ejercicio);
    };

    const handleDeleteEjercicio = async (ejercicioId) => {
        if (!window.confirm('¿Seguro que deseas eliminar este ejercicio?')) return;

        try {
            await eliminarEjercicio(ejercicioId);
            fetchRutina(); // Refresh list
        } catch (err) {
            alert(`Error al eliminar: ${err.message}`);
        }
    };

    const handleUpdateEjercicio = async (data) => {
        try {
            setIsUpdating(true);
            // Call API: PUT /api/ejercicios/{id}
            await actualizarEjercicio(editingEjercicio.id, {
                ...data, // Updated fields
                rutina_id: parseInt(id), // Ensure parent link
                orden: editingEjercicio.orden // Preserve order unless changed intentionally
            });

            // Success! Refresh data and close modal
            await fetchRutina();
            setEditingEjercicio(null);
            alert('¡Ejercicio actualizado correctamente!');
        } catch (err) {
            // Show validation error in alert for simplicity, or set a local error state
            alert(`Error al actualizar: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReorder = async (dia, newOrder) => {
        // 1. Optimistic Update (UI)
        const newEjerciciosPorDia = { ...rutina.ejercicios_por_dia };

        // Update the order locally
        newEjerciciosPorDia[dia] = newOrder.map((ej, index) => ({
            ...ej,
            orden: index + 1
        }));

        setRutina(prev => ({
            ...prev,
            ejercicios_por_dia: newEjerciciosPorDia
        }));

        // 2. Persist to Backend (Background)
        try {
            // We only need to update the exercises that changed order
            const updatePromises = newEjerciciosPorDia[dia].map(ejercicio =>
                actualizarEjercicio(ejercicio.id, {
                    ...ejercicio, // Send all fields just in case
                    rutina_id: rutina.id,
                    orden: ejercicio.orden
                })
            );

            await Promise.all(updatePromises);
            console.log('Orden actualizado correctamente');
        } catch (err) {
            console.error('Error al guardar el orden:', err);
            alert('Error al guardar el nuevo orden en el servidor');
            fetchRutina(); // Revert to server state on error
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading && !rutina) {
        return <LoadingSpinner message="Cargando rutina..." />;
    }

    if (error && !rutina) {
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

    if (!rutina) {
        return null;
    }

    return (
        <div className="page-container fade-in">
            {/* Header with actions */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <Link to="/" className="btn btn-secondary btn-sm" style={{ marginBottom: 'var(--spacing-md)' }}>
                    ← Volver a Rutinas
                </Link>

                <div className="card" style={{ marginTop: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 'var(--spacing-lg)' }}>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>{rutina.nombre}</h1>
                            {rutina.descripcion && (
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                                    {rutina.descripcion}
                                </p>
                            )}
                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                📅 Creada el {formatDate(rutina.fecha_creacion)}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                <button
                                    onClick={() => exportRutinaToPDF(rutina, rutina.ejercicios_por_dia)}
                                    className="btn btn-success btn-sm"
                                    title="Descargar PDF"
                                >
                                    📄 PDF
                                </button>

                                <Link
                                    to={`/rutinas/${id}/editar`}
                                    className="btn btn-primary btn-sm"
                                >
                                    ⚙️ Administrar
                                </Link>

                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={handleDelete}
                                        className="btn btn-danger btn-sm"
                                        disabled={isDeleting}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleDelete}
                                            className="btn btn-danger btn-sm"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? '⏳ Eliminando...' : '✓ Confirmar'}
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="btn btn-secondary btn-sm"
                                            disabled={isDeleting}
                                        >
                                            ✕ Cancelar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Toggle & Content */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ marginBottom: 0 }}>📋 Ejercicios</h2>
                    <div style={{ background: 'var(--color-bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '4px' }}>
                        <button
                            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setViewMode('list')}
                            style={{ margin: 0, borderRadius: '4px', border: 'none', background: viewMode === 'list' ? undefined : 'transparent' }}
                        >
                            📝 Lista
                        </button>
                        <button
                            className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setViewMode('calendar')}
                            style={{ margin: 0, borderRadius: '4px', border: 'none', background: viewMode === 'calendar' ? undefined : 'transparent' }}
                        >
                            📅 Calendario
                        </button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <EjerciciosList
                        ejerciciosPorDia={rutina.ejercicios_por_dia}
                        editable={true}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteEjercicio}
                        onReorder={handleReorder}
                    />
                ) : (
                    <CalendarioSemanal ejerciciosPorDia={rutina.ejercicios_por_dia} />
                )}
            </div>

            {/* Edit Modal */}
            {editingEjercicio && (
                <EditarEjercicio
                    ejercicio={editingEjercicio}
                    onSave={handleUpdateEjercicio}
                    onCancel={() => setEditingEjercicio(null)}
                />
            )}
        </div>
    );
};

export default DetalleRutina;
