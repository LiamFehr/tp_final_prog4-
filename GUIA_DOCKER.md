# 🐳 Guía de Uso con Docker

## 📋 Requisitos
- Tener instalado **Docker Desktop** y que esté corriendo.

## 🚀 Iniciar la Aplicación

Para levantar todo el sistema (Base de datos + Backend + Frontend), simplemente corre el siguiente comando en la terminal dentro de la carpeta del proyecto:

```powershell
docker-compose up --build
```

Esto descargará las imágenes necesarias, configurará la base de datos y levantará los servicios:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend (API)**: [http://localhost:8000](http://localhost:8000)

---

## ⚠️ Solución de Problemas Comunes

### 1. "Veo un error o pantalla vacía al abrir la app por primera vez" 🚨
**Esto es NORMAL.**

El sistema está protegido requiere que estés autenticado para ver las rutinas.
- **Causa**: Al abrir la app, intenta cargar rutinas, pero como no has iniciado sesión (o no tienes usuario), el backend devuelve un error `401 Unauthorized`.
- **Solución**:
    1. Si la app no te redirige automáticamente, ve a `/register` o busca el botón **"Registrarse"**.
    2. Crea un usuario nuevo.
    3. Inicia sesión con ese usuario.
    4. ¡Listo! Ahora podrás ver y crear rutinas.

### 2. "¿Mis datos se borran al cerrar Docker?"
**NO.**
Hemos configurado un "volumen" (`pgdata`) que guarda la información de la base de datos en tu disco. Puedes detener y reiniciar los contenedores las veces que quieras, y tus usuarios/rutinas seguirán ahí.

### 3. Detener la aplicación
Para apagar todo correctamente, presiona `Ctrl + C` en la terminal, o corre:

```powershell
docker-compose down
```
