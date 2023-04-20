from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "postgresql://postgres:password@localhost:5432/stresstest"
engine = create_engine(DATABASE_URL, pool_size=5)
SessionLocal = sessionmaker(autocommit=True, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    except:
        db.close()
