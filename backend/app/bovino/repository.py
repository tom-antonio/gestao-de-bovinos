from sqlalchemy.orm import Session

from .models import Bovino

# A UNICA parte do sistema que sabe que existe um banco. Se aparecer um
# `db.query` fora daqui, a camada vazou.


def listar(db: Session):
    return db.query(Bovino).all()


def buscar(db: Session, bovino_id: int):
    return db.query(Bovino).filter(Bovino.id == bovino_id).first()


def criar(db: Session, dados: dict):
    bovino = Bovino(**dados)
    db.add(bovino)
    db.commit()
    db.refresh(bovino)   # o id nasce no banco; sem isto ele vem None
    return bovino


def buscar_por_nome(db: Session, nome: str):
    return db.query(Bovino).filter(Bovino.nome == nome).first()


def atualizar(db: Session, bovino: Bovino, mudancas: dict):
    for campo, valor in mudancas.items():
        setattr(bovino, campo, valor)
    db.commit()
    db.refresh(bovino)
    return bovino


def excluir(db: Session, bovino: Bovino):
    db.delete(bovino)
    db.commit()
