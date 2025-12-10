from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.rutinas import router as rutinas_router
from routes.ejercicios import router as ejercicios_router
from routes.auth import router as auth_router

from contextlib import asynccontextmanager
from database.db import crear_tablas

@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_tablas()
    yield

app = FastAPI(lifespan=lifespan)

# Configurar CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"estado": "API funcionando correctamente"}

app.include_router(auth_router)
app.include_router(rutinas_router)
app.include_router(ejercicios_router)
