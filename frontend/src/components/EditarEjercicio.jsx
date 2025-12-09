import React from 'react';
import EjercicioForm from './EjercicioForm';

const EditarEjercicio = ({ ejercicio, onSave, onCancel }) => {
    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.content}>
                <EjercicioForm
                    initialData={ejercicio}
                    onSubmit={onSave}
                    onCancel={onCancel}
                />
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)', // Darker background for focus
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)', // Nice blur effect
        animation: 'fadeIn 0.2s ease-out',
    },
    content: {
        width: '100%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'var(--spacing-md)',
        animation: 'slideUp 0.3s ease-out',
        position: 'relative',
    }
};

export default EditarEjercicio;
