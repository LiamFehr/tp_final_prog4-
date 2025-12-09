# Backend - API con FastAPI

## Configuración Rápida

### 1. Crear entorno virtual (Python 3.12)

```powershell
py -3.12 -m venv venv
.\venv\Scripts\activate
```

### 2. Instalar dependencias

```powershell
pip install -r requirements.txt
```

### 3. Configurar `.env`

Editá el archivo `.env` con tus credenciales:

```env
DATABASE_URL=postgresql://liam:liam@localhost:5433/GymApp
```

**Nota:** Asegurate de que el puerto sea **5433** (o el que uses en tu PostgreSQL).

### 4. Ejecutar el servidor

```powershell
uvicorn main:app --reload
```

El servidor estará en: **http://127.0.0.1:8000**

## Verificar

```powershell
curl http://127.0.0.1:8000/
```

Respuesta: `{"estado":"API funcionando correctamente"}`

## Estructura

```
backend/
├── main.py              # Aplicación FastAPI
├── requirements.txt     # Dependencias
├── .env                 # Variables de entorno
├── models/
│   └── rutina.py       # Modelo Rutina
├── routes/
└── database/
    └── db.py           # Conexión PostgreSQL
```

## Nota

Los warnings UTF-8 en los logs de SQLAlchemy son normales y no afectan el funcionamiento.

