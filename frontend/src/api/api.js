import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido';
        console.error('API Error:', errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
);

// ============ RUTINAS ============

export const getRutinas = async (page = 1, limit = 10) => {
    const response = await api.get(`/rutinas?page=${page}&limit=${limit}`);
    return response.data;
};

export const getRutinaById = async (id) => {
    const response = await api.get(`/rutinas/${id}`);
    return response.data;
};

export const getRutinaDetalle = async (id) => {
    const response = await api.get(`/rutinas/${id}/detalle`);
    return response.data;
};

export const buscarRutinas = async (nombre) => {
    const response = await api.get('/rutinas/buscar', {
        params: { nombre },
    });
    return response.data;
};

export const crearRutina = async (data) => {
    const response = await api.post('/rutinas', data);
    return response.data;
};

export const actualizarRutina = async (id, data) => {
    const response = await api.put(`/rutinas/${id}`, data);
    return response.data;
};

export const eliminarRutina = async (id) => {
    const response = await api.delete(`/rutinas/${id}`);
    return response.data;
};

// ============ EJERCICIOS ============

export const crearEjercicio = async (data) => {
    const response = await api.post('/ejercicios', data);
    return response.data;
};

export const actualizarEjercicio = async (id, data) => {
    const response = await api.put(`/ejercicios/${id}`, data);
    return response.data;
};

export const eliminarEjercicio = async (id) => {
    const response = await api.delete(`/ejercicios/${id}`);
    return response.data;
};

export default api;
