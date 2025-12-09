import React, { useState, useEffect } from 'react';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const EjercicioForm = ({ initialData = null, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        dia: 'Lunes',
        series: '',
        repeticiones: '',
        peso: '',
        notas: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                dia: initialData.dia || 'Lunes',
                series: initialData.series || '',
                repeticiones: initialData.repeticiones || '',
                peso: initialData.peso || '',
                notas: initialData.notas || '',
            });
        }
    }, [initialData]);

    const validate = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre del ejercicio es requerido';
        }

        if (!formData.series || formData.series <= 0) {
            newErrors.series = 'Las series deben ser un número positivo';
        }

        if (!formData.repeticiones || formData.repeticiones <= 0) {
            newErrors.repeticiones = 'Las repeticiones deben ser un número positivo';
        }

        if (formData.peso && formData.peso < 0) {
            newErrors.peso = 'El peso debe ser un número positivo';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const dataToSubmit = {
                ...formData,
                series: parseInt(formData.series),
                repeticiones: parseInt(formData.repeticiones),
                peso: formData.peso ? parseFloat(formData.peso) : null,
            };
            onSubmit(dataToSubmit);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>
                {initialData ? '✏️ Editar Ejercicio' : '➕ Agregar Ejercicio'}
            </h3>

            <div className="form-group">
                <label htmlFor="nombre">Nombre del Ejercicio *</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="ej: Press de banca, Sentadillas..."
                />
                {errors.nombre && <div className="form-error">{errors.nombre}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="dia">Día de la Semana *</label>
                <select id="dia" name="dia" value={formData.dia} onChange={handleChange}>
                    {DIAS_SEMANA.map((dia) => (
                        <option key={dia} value={dia}>
                            {dia}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)' }}>
                <div className="form-group">
                    <label htmlFor="series">Series *</label>
                    <input
                        type="number"
                        id="series"
                        name="series"
                        value={formData.series}
                        onChange={handleChange}
                        min="1"
                        placeholder="3"
                    />
                    {errors.series && <div className="form-error">{errors.series}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="repeticiones">Repeticiones *</label>
                    <input
                        type="number"
                        id="repeticiones"
                        name="repeticiones"
                        value={formData.repeticiones}
                        onChange={handleChange}
                        min="1"
                        placeholder="12"
                    />
                    {errors.repeticiones && <div className="form-error">{errors.repeticiones}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="peso">Peso (kg)</label>
                    <input
                        type="number"
                        id="peso"
                        name="peso"
                        value={formData.peso}
                        onChange={handleChange}
                        min="0"
                        step="0.5"
                        placeholder="20"
                    />
                    {errors.peso && <div className="form-error">{errors.peso}</div>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notas">Notas (opcional)</label>
                <textarea
                    id="notas"
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Observaciones sobre el ejercicio..."
                />
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <button type="button" onClick={handleSubmit} className="btn btn-primary" style={{ flex: 1 }}>
                    {initialData ? '💾 Guardar Cambios' : '➕ Agregar Ejercicio'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn btn-secondary">
                        ✕ Cancelar
                    </button>
                )}
            </div>
        </div>
    );
};

export default EjercicioForm;
