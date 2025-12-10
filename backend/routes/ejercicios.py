from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from database.db import engine
from database.session import get_session
from models.ejercicio import Ejercicio
from models.ejercicio_schema import EjercicioCreate
from models.ejercicio_update_schema import EjercicioUpdate
from routes.auth import get_current_user

router = APIRouter()


@router.post("/ejercicios", status_code=201)
def crear_ejercicio(ejercicio_data: EjercicioCreate, session: Session = Depends(get_session), current_user = Depends(get_current_user)):
    from models.rutina import Rutina
    from sqlalchemy.exc import IntegrityError
    
    # Validar que la rutina existe
    rutina = session.get(Rutina, ejercicio_data.rutina_id)
    if not rutina:
        raise HTTPException(
            status_code=404, 
            detail=f"No se encontró la rutina con ID {ejercicio_data.rutina_id}. Por favor, crea la rutina primero o usa un ID de rutina válido."
        )
    
    try:
        ejercicio = Ejercicio(
            rutina_id=ejercicio_data.rutina_id,
            nombre=ejercicio_data.nombre,
            dia=ejercicio_data.dia,
            series=ejercicio_data.series,
            repeticiones=ejercicio_data.repeticiones,
            peso=ejercicio_data.peso,
            notas=ejercicio_data.notas,
            orden=ejercicio_data.orden
        )
        session.add(ejercicio)
        session.commit()
        session.refresh(ejercicio)
        return ejercicio
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(
            status_code=400, 
            detail=f"Error de integridad de datos: {str(e.orig)}"
        )
    except Exception as e:
        session.rollback()
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/ejercicios")
def listar_ejercicios(session: Session = Depends(get_session), current_user = Depends(get_current_user)):
    ejercicios = session.query(Ejercicio).all()
    return ejercicios

@router.get("/ejercicios/{ejercicio_id}")
def obtener_ejercicio_por_id(ejercicio_id: int, session: Session = Depends(get_session), current_user = Depends(get_current_user)):
    ejercicio = session.get(Ejercicio, ejercicio_id)
    
    if not ejercicio:
        raise HTTPException(status_code=404, detail=f"No se encontró el ejercicio con ID {ejercicio_id}")
    
    return ejercicio

@router.put("/ejercicios/{ejercicio_id}")
def actualizar_ejercicio(
    ejercicio_id: int,
    ejercicio_data: EjercicioUpdate,
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user)
):
    from models.rutina import Rutina
    from sqlalchemy.exc import IntegrityError
    
    ejercicio = session.get(Ejercicio, ejercicio_id)
    
    if not ejercicio:
        raise HTTPException(status_code=404, detail=f"No se encontró el ejercicio con ID {ejercicio_id}")
    
    # Validar que la nueva rutina existe si se está actualizando
    if ejercicio_data.rutina_id is not None:
        rutina = session.get(Rutina, ejercicio_data.rutina_id)
        if not rutina:
            raise HTTPException(
                status_code=404,
                detail=f"No se encontró la rutina con ID {ejercicio_data.rutina_id}. Por favor, usa un ID de rutina válido."
            )
        ejercicio.rutina_id = ejercicio_data.rutina_id
    
    if ejercicio_data.nombre is not None:
        ejercicio.nombre = ejercicio_data.nombre
    
    if ejercicio_data.dia is not None:
        ejercicio.dia = ejercicio_data.dia
        
    if ejercicio_data.series is not None:
        ejercicio.series = ejercicio_data.series
        
    if ejercicio_data.repeticiones is not None:
        ejercicio.repeticiones = ejercicio_data.repeticiones
        
    if ejercicio_data.peso is not None:
        ejercicio.peso = ejercicio_data.peso
        
    if ejercicio_data.notas is not None:
        ejercicio.notas = ejercicio_data.notas
        
    if ejercicio_data.orden is not None:
        ejercicio.orden = ejercicio_data.orden
    
    try:
        session.add(ejercicio)
        session.commit()
        session.refresh(ejercicio)
        return ejercicio
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Error de integridad de datos: {str(e.orig)}")
    except Exception as e:
        session.rollback()
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.delete("/ejercicios/{ejercicio_id}")
def eliminar_ejercicio(ejercicio_id: int, session: Session = Depends(get_session), current_user = Depends(get_current_user)):
    ejercicio = session.get(Ejercicio, ejercicio_id)
    
    if not ejercicio:
        raise HTTPException(status_code=404, detail=f"No se encontró el ejercicio con ID {ejercicio_id}")
    
    try:
        session.delete(ejercicio)
        session.commit()
        return {"mensaje": "Ejercicio eliminado correctamente"}
    except Exception as e:
        session.rollback()
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")
