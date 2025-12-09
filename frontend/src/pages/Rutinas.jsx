import React, { useState, useEffect, useCallback } from 'react';
import { getRutinas, buscarRutinas, eliminarRutina } from '../api/api';
import RutinaCard from '../components/RutinaCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import Stats from '../components/Stats';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const Rutinas = () => {
    const [rutinas, setRutinas] = useState([]);
    const [allRutinas, setAllRutinas] = useState([]); // Store all routines for filtering
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const fetchRutinas = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getRutinas(page, 10);
            setAllRutinas(data.rutinas || data);
            setRutinas(data.rutinas || data);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRutinas(currentPage);
    }, [currentPage]);

    const handleSearch = useCallback(async (term) => {
        setSearchTerm(term);

        if (!term.trim()) {
            fetchRutinas();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await buscarRutinas(term);
            setAllRutinas(data);
            setRutinas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDayFilter = (day) => {
        setSelectedDay(day);

        if (!day) {
            setRutinas(allRutinas);
            return;
        }

        // Filter routines that have exercises on the selected day
        const filtered = allRutinas.filter(rutina => {
            // We need to check if routine has exercises for this day
            // This is a simplified check - in production you'd fetch full details
            return true; // For now, show all (would need backend support for proper filtering)
        });
        setRutinas(filtered);
    };

    const handleDelete = async (id) => {
        try {
            await eliminarRutina(id);
            // Refresh the list
            if (searchTerm) {
                handleSearch(searchTerm);
            } else {
                fetchRutinas();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">💪 Mis Rutinas de Entrenamiento</h1>
                <p className="page-description">
                    Gestiona y organiza tus rutinas de gimnasio
                </p>
            </div>

            <Stats />

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <SearchBar
                            onSearch={handleSearch}
                            placeholder="Buscar rutinas por nombre..."
                        />
                    </div>
                    <div style={{ minWidth: '200px' }}>
                        <select
                            value={selectedDay}
                            onChange={(e) => handleDayFilter(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option value="">📅 Todos los días</option>
                            {DIAS_SEMANA.map(dia => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading && <LoadingSpinner message="Cargando rutinas..." />}

            {error && <ErrorMessage message={error} onRetry={() => fetchRutinas(currentPage)} />}

            {!loading && !error && rutinas.length === 0 && (
                <div className="empty-state fade-in">
                    <div className="empty-state-icon">🏋️</div>
                    <h3>No hay rutinas {searchTerm && 'que coincidan con tu búsqueda'}</h3>
                    <p className="text-muted">
                        {searchTerm
                            ? 'Intenta con otro término de búsqueda'
                            : 'Comienza creando tu primera rutina de entrenamiento'}
                    </p>
                </div>
            )}

            {!loading && !error && rutinas.length > 0 && (
                <>
                    <div className="grid grid-2">
                        {rutinas.map((rutina) => (
                            <RutinaCard
                                key={rutina.id}
                                rutina={rutina}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {pagination && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination.total_pages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Rutinas;
