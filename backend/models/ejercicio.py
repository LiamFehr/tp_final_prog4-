from typing import Optional
from sqlmodel import SQLModel, Field

class Ejercicio(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rutina_id: int = Field(foreign_key="rutina.id", nullable=False)
    nombre: str = Field(max_length=255, nullable=False)
    dia: Optional[str] = Field(default=None, max_length=20)
    series: Optional[int] = None
    repeticiones: Optional[int] = None
    peso: Optional[float] = None
    notas: Optional[str] = None
    orden: Optional[int] = None
