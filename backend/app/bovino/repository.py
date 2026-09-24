from sqlalchemy.orm import Session

from .models import Bovino

# A UNICA parte do sistema que sabe que existe um banco. Se aparecer um
# `db.query` fora daqui, a camada vazou.

def listar(db: Session, dono_id: int, nome: str | None = None, status: bool | None = None):
    consulta = db.query(Bovino).filter(Bovino.dono_id == dono_id)
    if nome:
        consulta = consulta.filter(Bovino.nome.ilike(f"%{nome}%"))
    if status is not None:
        consulta = consulta.filter(Bovino.status == status)
    return consulta.all()

def buscar(db: Session, bovino_id: int):
    return db.query(Bovino).filter(Bovino.id == bovino_id).first()


def criar(db: Session, dados: dict):
    bovino = Bovino(**dados)
    db.add(bovino)
    db.commit()
    db.refresh(bovino)   # o id nasce no banco; sem isto ele vem None
    return bovino


def buscar_por_nome(db: Session, dono_id: int, nome: str):
    return db.query(Bovino).filter(Bovino.dono_id == dono_id, Bovino.nome == nome).first()


def atualizar(db: Session, bovino: Bovino, mudancas: dict):
    for campo, valor in mudancas.items():
        setattr(bovino, campo, valor)
    db.commit()
    db.refresh(bovino)
    return bovino


def excluir(db: Session, bovino: Bovino):
    db.delete(bovino)
    db.commit()
