from typing import Optional
from pydantic import BaseModel

class RutinaCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None