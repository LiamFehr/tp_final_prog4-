import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRutinaDetalle } from '../api/api';

const RutinaCard = ({ rutina, onDelete }) => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCardClick = (e) => {
        // Don't navigate if clicking delete button
        if (e.target.closest('.delete-btn')) return;
        navigate(`/rutinas/${rutina.id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }

        setIsDeleting(true);
        try {
            await onDelete(rutina.id);
        } catch (error) {
            console.error('Error deleting:', error);
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        setShowConfirm(false);
    };

    const handleDuplicate = async (e) => {
        e.stopPropagation();
        try {
            // Fetch full routine details with exercises
            const fullRutina = await getRutinaDetalle(rutina.id);
            // Navigate to create page with routine data
            navigate('/rutinas/nueva', {
                state: {
                    duplicateFrom: {
                        nombre: `${rutina.nombre} (Copia)`,
                        descripcion: rutina.descripcion,
                        ejercicios: fullRutina.ejercicios || []
                    }
                }
            });
        } catch (error) {
            console.error('Error duplicating:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="card fade-in" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>
                    {rutina.nombre}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0' }}>
                    📅 Creada el {formatDate(rutina.fecha_creacion)}
                </p>
            </div>

            {rutina.descripcion && (
                <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                    {rutina.descripcion.length > 100
                        ? `${rutina.descripcion.substring(0, 100)}...`
                        : rutina.descripcion}
                </p>
            )}

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'auto' }}>
                <button
                    onClick={handleCardClick}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                >
                    👁️ Ver Detalle
                </button>

                <button
                    onClick={handleDuplicate}
                    className="btn btn-secondary btn-sm"
                    title="Duplicar rutina"
                >
                    📋
                </button>

                {!showConfirm ? (
                    <button
                        onClick={handleDelete}
                        className="btn btn-danger btn-sm delete-btn"
                        disabled={isDeleting}
                    >
                        🗑️
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleDelete}
                            className="btn btn-danger btn-sm delete-btn"
                            disabled={isDeleting}
                        >
                            {isDeleting ? '⏳' : '✓ Confirmar'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="btn btn-secondary btn-sm"
                            disabled={isDeleting}
                        >
                            ✕
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default RutinaCard;
