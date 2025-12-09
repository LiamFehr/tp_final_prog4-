# 🏋️ GymApp Backend (FastAPI)

API REST para la gestión de rutinas de entrenamiento, ejercicios y autenticación de usuarios. Construido con **FastAPI**, **SQLModel** y **PostgreSQL**.

## 🚀 Requisitos
- **Python 3.10** o superior.
- **PostgreSQL** instalado.
- **Dependencias Clave:**
  - FastAPI
  - Uvicorn
  - SQLModel
  - Passlib[bcrypt]
  - Bcrypt v3.2.2 (Requerido para Windows)
  - Python-Jose
  - Python-Multipart

## 🛠️ Instalación

1.  **Clonar el repositorio y navegar al backend**:
    ```bash
    cd backend
    ```

2.  **Crear y activar entorno virtual**:
    ```bash
    # Windows
    py -m venv venv
    .\venv\Scripts\activate

    # Linux/Mac
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Instalar dependencias**:
    ```bash
    pip install -r requirements.txt
    ```

## ⚙️ Configuración (.env)
Crea un archivo `.env` en la raíz de `backend/` con tus credenciales de base de datos:

```env
# Ejemplo de configuración
DATABASE_URL=postgresql://usuario:password@localhost:5432/GymApp
SECRET_KEY=tu_clave_secreta_super_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

> **Nota**: `DATABASE_URL` debe apuntar a una base de datos PostgreSQL existente (ej. `GymApp`). Las tablas se crean automáticamente al iniciar.

## ▶️ Ejecución
Para iniciar el servidor en modo desarrollo:

```bash
python -m uvicorn main:app --reload
```
El servidor correrá en `http://127.0.0.1:8000`.

## 📚 Documentación de API
FastAPI genera documentación interactiva automáticamente. Una vez corriendo, visita:

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Resumen de Endpoints

#### 🔐 Autenticación
- `POST /register`: Registrar nuevo usuario.
- `POST /token`: Iniciar sesión (retorna JWT).

#### 📋 Rutinas (Requiere Token)
- `GET /rutinas`: Listar rutinas (paginado).
- `POST /rutinas`: Crear rutina.
- `GET /rutinas/{id}`: Detalle de rutina.
- `GET /rutinas/{id}/detalle`: Detalle completo con ejercicios agrupados.
- `PUT /rutinas/{id}`: Actualizar rutina.
- `DELETE /rutinas/{id}`: Eliminar rutina.

#### 🏋️ Ejercicios (Requiere Token)
- `GET /ejercicios`: Listar ejercicios.
- `POST /ejercicios`: Agregar ejercicio a rutina.
- `PUT /ejercicios/{id}`: Modificar ejercicio.
- `DELETE /ejercicios/{id}`: Eliminar ejercicio.

---
**Desarrollado para TP Programación IV - UTN**
