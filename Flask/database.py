from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "postgresql://postgres:password@localhost:5432/stresstest"
engine = create_engine(DATABASE_URL, pool_size=5)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()