import os
import time
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine
from sqlalchemy.exc import OperationalError

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = None


def get_engine_with_retry(retries=10, delay=3):
    global engine

    for i in range(retries):
        try:
            engine = create_engine(DATABASE_URL, echo=True)
            conn = engine.connect()
            conn.close()
            print("✅ Conectado a PostgreSQL correctamente")
            return engine
        except OperationalError:
            print(f"⏳ PostgreSQL no disponible aún (intento {i+1}/{retries})...")
            time.sleep(delay)

    raise RuntimeError("❌ No se pudo conectar a PostgreSQL luego de varios intentos.")


def crear_tablas():
    global engine

    if engine is None:
        engine = get_engine_with_retry()

    from models.rutina import Rutina
    from models.ejercicio import Ejercicio
    from models.user import User

    SQLModel.metadata.create_all(engine)
    print("✅ Tablas creadas/verificadas correctamente")
