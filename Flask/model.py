from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata

class Henkilo(Base):
    __tablename__ = 'henkilo'

    id = Column(Integer, primary_key=True, server_default=text("nextval('henkilo_id_seq'::regclass)"))
    nimi = Column(String(5), nullable=False)
    @property
    def serialized(self):
        return {
            'id': self.id,
            'nimi': self.nimi
        }


class Kortti(Base):
    __tablename__ = 'kortti'

    id = Column(Integer, primary_key=True, server_default=text("nextval('kortti_id_seq'::regclass)"))
    teksti = Column(String(64), nullable=False)

    def serialized(self):
        return {
            'id': self.id,
            'teksti': self.teksti
        }


class Oikeudet(Base):
    __tablename__ = 'oikeudet'

    henkilo_id = Column(ForeignKey('henkilo.id'), primary_key=True, nullable=False)
    kortti_id = Column(ForeignKey('kortti.id'), primary_key=True, nullable=False)
    hallitsija = Column(Boolean, nullable=False)

    henkilo = relationship('Henkilo')
    kortti = relationship('Kortti')

    def serialized(self):
        return {
            'henkilo_id': self.henkilo_id,
            'kortti_id': self.kortti_id,
            'hallitsija': self.hallitsija
        }