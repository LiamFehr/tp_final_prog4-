from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.rutinas import router as rutinas_router
from routes.ejercicios import router as ejercicios_router

app = FastAPI()

# Configurar CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos los headers
)


@app.get("/")
def read_root():
    return {"estado": "API funcionando correctamente"}

app.include_router(rutinas_router)
app.include_router(ejercicios_router)
