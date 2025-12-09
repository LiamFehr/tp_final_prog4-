import React from 'react';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
    return (
        <div className="loading-container fade-in">
            <div className="loading-spinner"></div>
            <p className="text-muted mt-lg">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
