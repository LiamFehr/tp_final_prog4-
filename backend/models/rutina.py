from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class Rutina(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, nullable=False, unique=True)
    descripcion: Optional[str] = None   
    fecha_creacion: Optional[datetime] = None

    ejercicios: List["Ejercicio"] = Relationship(back_populates="rutina", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
