from sqlmodel import Session
from database.db import get_engine_with_retry

engine = get_engine_with_retry()

def get_session():
    with Session(engine) as session:
        yield session
