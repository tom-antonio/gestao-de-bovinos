from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..seguranca import get_current_user
from . import service
from .schemas import BovinoCriar, BovinoPublico, BovinoAtualizar

router = APIRouter(
    prefix="/bovinos", 
    tags=["Bovinos"], 
    dependencies=[Depends(get_current_user)])

# Banco de mentira: uma lista em memoria. Vira banco de verdade no encontro 4.
bovinos: list[dict] = []


@router.get("/", response_model=list[BovinoPublico])
def listar(db: Session = Depends(get_db)):
    return service.listar(db)

@router.post("/", response_model=BovinoPublico, status_code=201)
def criar(dados: BovinoCriar, db: Session = Depends(get_db)):
    return service.criar(db, dados.model_dump())

@router.get("/{bovino_id}", response_model=BovinoPublico)
def buscar(bovino_id: int, db: Session = Depends(get_db)):
    return service.buscar(db, bovino_id)


@router.patch("/{bovino_id}", response_model=BovinoPublico)
def atualizar(bovino_id: int, dados: BovinoAtualizar, db: Session = Depends(get_db)):
    return service.atualizar(
        db, bovino_id, dados.model_dump(exclude_unset=True)
        )

@router.delete("/{bovino_id}", status_code=204)
def apagar(bovino_id: int, db: Session = Depends(get_db)):
    return service.excluir(db, bovino_id)
