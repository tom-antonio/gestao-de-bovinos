from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..database import Base

class Bovino(Base):
    """A TABELA. Nao confunda com os schemas: aquilo atravessa a
    fronteira da API, isto vira linha no banco.
    """

    __tablename__ = "bovinos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    raca = Column(String(120), nullable=False)
    nome_mae = Column(String(120), nullable=False)
    status = Column(Boolean, default=True, nullable=False)

    dono_id = Column(Integer, ForeignKey("usuarios.id", name="fk_bovinos_dono"), nullable=True)
    dono = relationship("Usuario", back_populates="bovinos")