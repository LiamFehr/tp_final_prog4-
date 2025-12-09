from typing import Optional
from sqlmodel import SQLModel
from pydantic import field_validator, Field

class EjercicioCreate(SQLModel):
    rutina_id: int
    nombre: str
    dia: Optional[str] = None
    series: Optional[int] = Field(default=None, gt=0)
    repeticiones: Optional[int] = Field(default=None, gt=0)
    peso: Optional[float] = Field(default=None, ge=0)
    notas: Optional[str] = None
    orden: Optional[int] = None
