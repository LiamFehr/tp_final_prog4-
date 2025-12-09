from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Rutina(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, nullable=False, unique=True)
    descripcion: Optional[str] = None   
    fecha_creacion: Optional[datetime] = None
