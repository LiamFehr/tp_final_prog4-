# 💻 Frontend - Sistema de Gestión de Rutinas

Aplicación web moderna desarrollada con **React** y **Vite** para la gestión integral de rutinas de gimnasio.

## 🚀 Tecnologías Principales

- **React 19**: Biblioteca UI core.
- **Vite 6**: Build tool de alta velocidad.
- **Axios**: Cliente HTTP para comunicación API.
- **React Router 7**: Manejo de navegación SPA.
- **@dnd-kit**: Biblioteca para funcionalidad Drag & Drop.
- **jsPDF**: Generación y descarga de reportes PDF.
- **CSS Modules/Variables**: Estilizado moderno y mantenible.

## 📂 Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/          # Configuración de Axios y endpoints
│   ├── components/   # Componentes UI reutilizables (Cards, Modals, Forms)
│   ├── pages/        # Vistas principales de la aplicación
│   ├── services/     # Lógica de negocio adicional
│   ├── utils/        # Funciones helpers (PDF Export, Formateo)
│   ├── App.jsx       # Componente raíz y Rutas
│   └── main.jsx      # Punto de entrada
├── public/           # Assets estáticos
└── index.html        # HTML base
```

## ⚙️ Configuración

La URL del backend se encuentra definida en:
`src/api/api.js`

```javascript
const API_BASE_URL = 'http://localhost:8000';
```
*Si el backend se ejecuta en otro puerto, modifique esta línea.*

## 🛠️ Instalación y Ejecución

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Iniciar Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
    > El frontend estará disponible en: **http://localhost:5173**

3.  **Construir para Producción (Build):**
    ```bash
    npm run build
    ```

## ✨ Funcionalidades Clave

- **Dashboard**: Estadísticas en tiempo real.
- **Gestor de Rutinas**: CRUD completo de rutinas.
- **Editor con Drag & Drop**: Reordenamiento visual de ejercicios.
- **Filtros Inteligentes**: Búsqueda por nombre y día.
- **Exportación**: Descarga de rutinas en formato PDF profesional.
