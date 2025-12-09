# 🎓 Guía de Instalación Paso a Paso - Trabajo Final Prog 4

Esta guía detalla los pasos exactos para instalar, configurar y ejecutar el proyecto completo (Backend + Frontend) desde cero.

---

## ✅ 1. Requisitos Previos

Asegúrese de tener instalado:
1.  **Python 3.10+**: [Descargar Python](https://www.python.org/downloads/)
2.  **Node.js 16+**: [Descargar Node.js](https://nodejs.org/)
3.  **PostgreSQL**: [Descargar PostgreSQL](https://www.postgresql.org/download/)

---

## 🗄️ 2. Configuración de Base de Datos

1. Abra **pgAdmin 4** (o su cliente SQL preferido).
2. Cree una nueva base de datos llamada `GymApp`.
3. Ejecute el siguiente script SQL para crear las tablas necesarias:

   ```sql
   -- Tabla rutina
   CREATE TABLE rutina (
       id SERIAL PRIMARY KEY,
       nombre VARCHAR(255) NOT NULL UNIQUE,
       descripcion TEXT,
       fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
   );

   -- Tabla ejercicio
   CREATE TABLE ejercicio (
       id SERIAL PRIMARY KEY,
       rutina_id INTEGER NOT NULL,
       nombre VARCHAR(255) NOT NULL,
       dia VARCHAR(20),
       series INTEGER,
       repeticiones INTEGER,
       peso DECIMAL(6,2),
       notas TEXT,
       orden INTEGER,
       CONSTRAINT fk_rutina FOREIGN KEY (rutina_id)
           REFERENCES rutina(id)
           ON DELETE CASCADE
   );

   -- Tabla user (Para Autenticación)
   CREATE TABLE "user" (
       id SERIAL PRIMARY KEY,
       username VARCHAR NOT NULL UNIQUE,
       hashed_password VARCHAR NOT NULL
   );
   ```

   > **Nota:** El sistema ahora crea las tablas automáticamente al iniciarse, pero puede ejecutar este script para mayor seguridad o control.

---

## 🐍 3. Instalación del Backend (API)

Abras su terminal (PowerShell o CMD) en la carpeta `backend`:

```powershell
cd backend
```

### Paso 3.1: Crear Entorno Virtual
```powershell
py -m venv venv
# O si usa python3: python3 -m venv venv
```

### Paso 3.2: Activar Entorno
```powershell
.\venv\Scripts\activate
# En Mac/Linux: source venv/bin/activate
```

### Paso 3.3: Instalar Dependencias
```powershell
pip install -r requirements.txt
```

### Paso 3.4: Configurar Variables de Entorno (.env)
Abra el archivo `.env` en la carpeta `backend` y **modifique sus credenciales**:

```env
# Formato: postgresql://USUARIO:CONTRASEÑA@localhost:PUERTO/NOMBRE_BD
DATABASE_URL=postgresql://postgres:su_contraseña@localhost:5433/GymApp
```
*Asegúrese de poner su usuario (usualmente `postgres`), su contraseña y el puerto correcto (usualmente `5432`).*

### Paso 3.5: Iniciar el Servidor
```powershell
python -m uvicorn main:app --reload
```
✅ **Verificación:** Abra [http://localhost:8000/docs](http://localhost:8000/docs). Debería ver la documentación Swagger.

---

## 💻 4. Instalación del Frontend (React)

Abra **otra terminal nueva** (no cierre la del backend) y vaya a la carpeta `frontend`:

```powershell
cd frontend
```

### Paso 4.1: Instalar Dependencias
```powershell
npm install
```

### Paso 4.2: Iniciar la Aplicación
```powershell
npm run dev
```

✅ **Verificación:** Abra [http://localhost:5173](http://localhost:5173). Debería ver la aplicación funcionando.

### Paso 4.3: Registro e Inicio de Sesión
El sistema cuenta con autenticación protegida.
1. Al abrir la app, será redirigido al **Login**.
2. Haga clic en **"Registrarse"** para crear un usuario.
3. Inicie sesión con sus credenciales para acceder a sus rutinas.

---

## 🔧 5. Solución de Problemas Comunes

### 🔴 Error: "Network Error" en el Frontend
- **Causa:** El backend no está corriendo o el frontend cambió de puerto.
- **Solución:**
  1. Asegúrese que el backend esté corriendo en el puerto `8000`.
  2. Si el frontend se abrió en un puerto diferente al `5173` (ej. `5174`), **NO HAY PROBLEMA**, el sistema ya está configurado para aceptarlo.

### 🔴 Error de Conexión a Base de Datos
- **Log:** `FATAL: password authentication failed`
- **Solución:** Revise su archivo `backend/.env`. La contraseña de PostgreSQL es incorrecta.

### 🔴 Error: "Module not found"
- **Solución:** Olvidó ejecutar `pip install -r requirements.txt` (Backend) o `npm install` (Frontend).

---

**¡Listo! El proyecto debería estar funcionando correctamente.**
