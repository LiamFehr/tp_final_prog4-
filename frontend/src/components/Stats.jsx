import React, { useEffect, useState } from 'react';
import { getRutinas } from '../api/api';

const Stats = () => {
    const [stats, setStats] = useState({
        totalRutinas: 0,
        totalEjercicios: 0,
        diaMasEntrenado: '-'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch all routines to calculate stats
                const data = await getRutinas(1, 100); // Get first 100
                const rutinas = data.rutinas || data;

                setStats({
                    totalRutinas: data.pagination?.total || rutinas.length,
                    totalEjercicios: '-', // Would need to fetch all details
                    diaMasEntrenado: '-'
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return null;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)'
        }}>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>💪</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {stats.totalRutinas}
                </div>
                <div className="text-muted">Rutinas Totales</div>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>🏋️</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                    {stats.totalEjercicios}
                </div>
                <div className="text-muted">Ejercicios</div>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>📅</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                    {stats.diaMasEntrenado}
                </div>
                <div className="text-muted">Día Más Entrenado</div>
            </div>
        </div>
    );
};

export default Stats;
