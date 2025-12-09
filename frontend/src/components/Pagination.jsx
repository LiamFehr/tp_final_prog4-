import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 'var(--spacing-xl)',
            flexWrap: 'wrap'
        }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary btn-sm"
            >
                ← Anterior
            </button>

            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="btn btn-secondary btn-sm"
                    >
                        1
                    </button>
                    {startPage > 2 && <span>...</span>}
                </>
            )}

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '40px' }}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span>...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="btn btn-secondary btn-sm"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-secondary btn-sm"
            >
                Siguiente →
            </button>
        </div>
    );
};

export default Pagination;
