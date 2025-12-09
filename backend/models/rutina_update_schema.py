from typing import Optional
from pydantic import BaseModel

class RutinaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
