from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata

class Henkilo(Base):
    __tablename__ = 'henkilo'

    id = Column(Integer, primary_key=True, server_default=text("nextval('henkilo_id_seq'::regclass)"))
    nimi = Column(String(5), nullable=False)


class Kortti(Base):
    __tablename__ = 'kortti'

    id = Column(Integer, primary_key=True, server_default=text("nextval('kortti_id_seq'::regclass)"))
    teksti = Column(String(64), nullable=False)


class Oikeudet(Base):
    __tablename__ = 'oikeudet'

    henkilo_id = Column(ForeignKey('henkilo.id'), primary_key=True, nullable=False)
    kortti_id = Column(ForeignKey('kortti.id'), primary_key=True, nullable=False)
    hallitsija = Column(Boolean, nullable=False)

    henkilo = relationship('Henkilo')
    kortti = relationship('Kortti')