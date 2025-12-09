# 💻 GymApp Frontend (React + Vite)

Interfaz de usuario para el sistema de gestión de gimnasio. Desarrollado con **React**, **Vite** y **Context Context** para autenticación.

## 🚀 Requisitos
- **Node.js** (versión 16 o superior).
- **NPM** (incluido con Node.js).
- El **Backend** corriendo en el puerto 8000.

## 🛠️ Instalación

1.  **Navegar a la carpeta frontend**:
    ```bash
    cd frontend
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

## ▶️ Ejecución (Desarrollo)

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

## 🔑 Autenticación
El sistema cuenta con rutas protegidas.
1.  Al abrir la app, serás redirigido a `/login`.
2.  Si no tienes cuenta, ve a `/register` para crear un usuario.
3.  Una vez logueado, el token se guarda en `localStorage` y se envía automáticamente en cada petición a la API.

## 📦 Estructura
- `src/api`: Configuración de Axios e interceptores.
- `src/context`: `AuthContext` para manejo de sesión global.
- `src/pages`: Vistas de la aplicación (Login, Registro, Rutinas, etc).
- `src/components`: Componentes reutilizables y `PrivateRoute` para protección.

## 🌐 Configuración
La URL de la API base está configurada en `src/api/api.js`. Por defecto es `http://localhost:8000`.

---
**Desarrollado para TP Programación IV - UTN**
