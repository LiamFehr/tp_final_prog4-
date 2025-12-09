import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="error-container fade-in">
            <h3 className="error-title">⚠️ Error</h3>
            <p className="error-message">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn btn-primary">
                    🔄 Reintentar
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
