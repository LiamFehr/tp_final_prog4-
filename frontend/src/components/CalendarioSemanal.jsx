import React from 'react';
import './CalendarioSemanal.css';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const CalendarioSemanal = ({ ejerciciosPorDia }) => {
    return (
        <div className="fade-in">
            <div className="calendario-grid">
                {DIAS.map(dia => {
                    const ejercicios = ejerciciosPorDia[dia] || [];

                    return (
                        <div key={dia} className="calendario-dia-wrapper">
                            <div className="calendario-header">{dia}</div>

                            <div className="calendario-columna">
                                {ejercicios.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem', padding: '10px' }}>
                                        -
                                    </div>
                                ) : (
                                    ejercicios.map(ej => (
                                        <div key={ej.id} className="calendario-ejercicio" title={`${ej.nombre}\n${ej.series}x${ej.repeticiones}\n${ej.notas || ''}`}>
                                            <div className="cal-ej-nombre">{ej.nombre}</div>
                                            <div className="cal-ej-detalles">
                                                {ej.series} x {ej.repeticiones}
                                            </div>
                                            {ej.peso > 0 && (
                                                <div className="cal-ej-peso">
                                                    {ej.peso} kg
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarioSemanal;
