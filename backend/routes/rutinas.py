from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from database.db import engine
from models.rutina import Rutina
from models.rutina_schema import RutinaCreate
from models.rutina_update_schema import RutinaUpdate

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

@router.post("/rutinas", status_code=201)
def crear_rutina(rutina_data: RutinaCreate, session: Session = Depends(get_session)):
    from datetime import datetime
    from sqlalchemy.exc import IntegrityError
    
    # Validar que no exista otra rutina con el mismo nombre
    rutina_existente = session.query(Rutina).filter(Rutina.nombre == rutina_data.nombre).first()
    if rutina_existente:
        raise HTTPException(
            status_code=400,
            detail=f"Ya existe una rutina con el nombre '{rutina_data.nombre}'. Por favor, usa un nombre diferente."
        )
    
    try:
        rutina = Rutina(
            nombre=rutina_data.nombre,
            descripcion=rutina_data.descripcion,
            fecha_creacion=datetime.now()
        )
        session.add(rutina)
        session.commit()
        session.refresh(rutina)
        return rutina
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(
            status_code=400,
            detail="Error de integridad de datos al crear la rutina"
        )
    except Exception as e:
        session.rollback()
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/rutinas")
def listar_rutinas(
    page: int = 1, 
    limit: int = 10, 
    session: Session = Depends(get_session)
):
    """
    Obtener lista de rutinas con paginación
    - page: número de página (default: 1)
    - limit: cantidad de resultados por página (default: 10, max: 100)
    """
    # Validate parameters
    if page < 1:
        page = 1
    if limit < 1 or limit > 100:
        limit = 10
    
    # Calculate offset
    offset = (page - 1) * limit
    
    # Get total count
    total = session.query(Rutina).count()
    
    # Get paginated results
    rutinas = session.query(Rutina).offset(offset).limit(limit).all()
    
    # Calculate total pages
    total_pages = (total + limit - 1) // limit  # Ceiling division
    
    return {
        "rutinas": rutinas,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }

@router.get("/rutinas/buscar")
def buscar_rutinas(nombre: str, session: Session = Depends(get_session)):
    """
    Busca rutinas por nombre (búsqueda parcial, case-insensitive)
    """
    rutinas = session.query(Rutina).filter(
        Rutina.nombre.ilike(f"%{nombre}%")
    ).all()
    return rutinas

@router.get("/rutinas/{rutina_id}")
def obtener_rutina_por_id(rutina_id: int, session: Session = Depends(get_session)):
    rutina = session.get(Rutina, rutina_id)
    
    if not rutina:
        raise HTTPException(status_code=404, detail=f"No se encontró la rutina con ID {rutina_id}")
    
    return rutina

@router.put("/rutinas/{rutina_id}")
def actualizar_rutina(
    rutina_id: int,
    rutina_data: RutinaUpdate,
    session: Session = Depends(get_session)
):
    from sqlalchemy.exc import IntegrityError
    
    rutina = session.get(Rutina, rutina_id)
    
    if not rutina:
        raise HTTPException(status_code=404, detail=f"No se encontró la rutina con ID {rutina_id}")
    
    # Validar que el nuevo nombre no esté en uso por otra rutina
    if rutina_data.nombre is not None:
        rutina_existente = session.query(Rutina).filter(
            Rutina.nombre == rutina_data.nombre,
            Rutina.id != rutina_id
        ).first()
        if rutina_existente:
            raise HTTPException(
                status_code=400,
                detail=f"Ya existe otra rutina con el nombre '{rutina_data.nombre}'. Por favor, usa un nombre diferente."
            )
        rutina.nombre = rutina_data.nombre
    
    if rutina_data.descripcion is not None:
        rutina.descripcion = rutina_data.descripcion
    
    try:
        session.add(rutina)
        session.commit()
        session.refresh(rutina)
        return rutina
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad de datos")
    except Exception as e:
        session.rollback()
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.delete("/rutinas/{rutina_id}")
def eliminar_rutina(rutina_id: int, session: Session = Depends(get_session)):
    rutina = session.get(Rutina, rutina_id)
    
    if not rutina:
        raise HTTPException(status_code=404, detail=f"No se encontró la rutina con ID {rutina_id}")
    
    try:
        session.delete(rutina)
        session.commit()
        return {"mensaje": "Rutina eliminada correctamente"}
    except Exception as e:
        session.rollback()
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")



@router.get("/rutinas/{rutina_id}/detalle")
def obtener_detalle_rutina(rutina_id: int, session: Session = Depends(get_session)):
    """
    Obtiene una rutina con todos sus ejercicios agrupados por día
    """
    from models.ejercicio import Ejercicio
    from collections import defaultdict
    
    rutina = session.get(Rutina, rutina_id)
    
    if not rutina:
        raise HTTPException(status_code=404, detail=f"No se encontró la rutina con ID {rutina_id}")
    
    # Obtener todos los ejercicios de esta rutina
    ejercicios = session.query(Ejercicio).filter(
        Ejercicio.rutina_id == rutina_id
    ).order_by(Ejercicio.dia, Ejercicio.orden).all()
    
    # Agrupar ejercicios por día
    ejercicios_por_dia = defaultdict(list)
    for ejercicio in ejercicios:
        dia = ejercicio.dia if ejercicio.dia else "Sin día asignado"
        ejercicios_por_dia[dia].append({
            "id": ejercicio.id,
            "nombre": ejercicio.nombre,
            "series": ejercicio.series,
            "repeticiones": ejercicio.repeticiones,
            "peso": ejercicio.peso,
            "notas": ejercicio.notas,
            "orden": ejercicio.orden
        })
    
    return {
        "id": rutina.id,
        "nombre": rutina.nombre,
        "descripcion": rutina.descripcion,
        "fecha_creacion": rutina.fecha_creacion,
        "ejercicios_por_dia": dict(ejercicios_por_dia),
        "ejercicios": ejercicios  # Also return flat list for duplicate functionality
    }
