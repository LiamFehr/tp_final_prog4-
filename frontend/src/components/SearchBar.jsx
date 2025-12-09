import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Buscar...' }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    const handleClear = () => {
        setSearchTerm('');
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                style={{
                    paddingRight: searchTerm ? '3rem' : '1rem',
                }}
            />
            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="btn-secondary btn-sm"
                    style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '0.25rem 0.5rem',
                        minWidth: 'auto',
                    }}
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default SearchBar;
