import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DIAS_ORDEN = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const SortableItem = ({ ejercicio, index, editable, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: ejercicio.id, disabled: !editable });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: editable ? 'grab' : 'default',
        touchAction: 'none', // Prevent scrolling while dragging on touch devices
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="card"
        >
            <div style={{
                background: 'var(--color-bg-tertiary)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-primary)' }}>
                            {editable && <span style={{ marginRight: '8px', cursor: 'grab' }}>☰</span>}
                            {index + 1}. {ejercicio.nombre}
                        </h4>

                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--spacing-lg)',
                                flexWrap: 'wrap',
                                marginBottom: ejercicio.notas ? 'var(--spacing-sm)' : '0',
                            }}
                        >
                            <span className="text-muted">
                                <strong style={{ color: 'var(--color-primary)' }}>Series:</strong> {ejercicio.series}
                            </span>
                            <span className="text-muted">
                                <strong style={{ color: 'var(--color-primary)' }}>Reps:</strong> {ejercicio.repeticiones}
                            </span>
                            {ejercicio.peso && (
                                <span className="text-muted">
                                    <strong style={{ color: 'var(--color-primary)' }}>Peso:</strong> {ejercicio.peso} kg
                                </span>
                            )}
                        </div>

                        {ejercicio.notas && (
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontStyle: 'italic', marginTop: 'var(--spacing-sm)' }}>
                                💡 {ejercicio.notas}
                            </p>
                        )}
                    </div>

                    {editable && (
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(ejercicio);
                                }}
                                className="btn btn-secondary btn-sm"
                                onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                            >
                                ✏️
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(ejercicio.id);
                                }}
                                className="btn btn-danger btn-sm"
                                onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                            >
                                🗑️
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EjerciciosList = ({ ejerciciosPorDia, editable = false, onEdit, onDelete, onReorder }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        // Find which day we are reordering
        // NOTE: dnd-kit might treat IDs as strings, so we compare loosely or convert
        const activeDay = Object.keys(ejerciciosPorDia).find(dia =>
            ejerciciosPorDia[dia].some(e => String(e.id) === String(active.id))
        );

        const overDay = Object.keys(ejerciciosPorDia).find(dia =>
            ejerciciosPorDia[dia].some(e => String(e.id) === String(over.id))
        );

        // Only allow reordering within the same day
        if (activeDay && activeDay === overDay) {
            const ejercicios = ejerciciosPorDia[activeDay];
            const oldIndex = ejercicios.findIndex(e => String(e.id) === String(active.id));
            const newIndex = ejercicios.findIndex(e => String(e.id) === String(over.id));

            const newOrder = arrayMove(ejercicios, oldIndex, newIndex);

            // Call parent handler
            if (onReorder) {
                onReorder(activeDay, newOrder);
            }
        }
    };

    // Sort days by week order
    const sortedDias = Object.keys(ejerciciosPorDia).sort((a, b) => {
        return DIAS_ORDEN.indexOf(a) - DIAS_ORDEN.indexOf(b);
    });

    if (sortedDias.length === 0) {
        return (
            <div className="empty-state">
                <p className="text-muted">No hay ejercicios asignados a esta rutina</p>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                {sortedDias.map((dia) => (
                    <div key={dia} className="fade-in">
                        <h3
                            style={{
                                color: 'var(--color-primary)',
                                marginBottom: 'var(--spacing-md)',
                                paddingBottom: 'var(--spacing-sm)',
                                borderBottom: '2px solid var(--color-border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                            }}
                        >
                            <span>📅</span>
                            {dia}
                            <span className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>
                                ({ejerciciosPorDia[dia].length} ejercicio{ejerciciosPorDia[dia].length !== 1 ? 's' : ''})
                            </span>
                        </h3>

                        <SortableContext
                            items={ejerciciosPorDia[dia].map(e => e.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                {ejerciciosPorDia[dia].map((ejercicio, index) => (
                                    <SortableItem
                                        key={ejercicio.id}
                                        ejercicio={ejercicio}
                                        index={index}
                                        editable={editable}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>
        </DndContext>
    );
};

export default EjerciciosList;
