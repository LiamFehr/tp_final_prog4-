from typing import Optional
from sqlmodel import SQLModel
from pydantic import Field

class EjercicioUpdate(SQLModel):
    rutina_id: Optional[int] = None
    nombre: Optional[str] = None
    dia: Optional[str] = None
    series: Optional[int] = Field(default=None, gt=0)
    repeticiones: Optional[int] = Field(default=None, gt=0)
    peso: Optional[float] = Field(default=None, ge=0)
    notas: Optional[str] = None
    orden: Optional[int] = None
