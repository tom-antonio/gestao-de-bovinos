from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..seguranca import get_current_user
from ..usuarios.models import Usuario
from . import service
from .schemas import BovinoCriar, BovinoPublico, BovinoAtualizar

router = APIRouter(
    prefix="/bovinos", 
    tags=["Bovinos"], 
    dependencies=[Depends(get_current_user)])

bovinos: list[dict] = []


@router.get("/", response_model=list[BovinoPublico])
def listar(nome: str | None = None,
           status: bool | None = None, 
           usuario: Usuario = Depends(get_current_user), 
           db: Session = Depends(get_db)):
    return service.listar(db, usuario, nome, status)

@router.post("/", response_model=BovinoPublico, status_code=201)
def criar(dados: BovinoCriar,
          usuario: Usuario = Depends(get_current_user),
          db: Session = Depends(get_db)):
    return service.criar(db, dados.model_dump(), usuario)

@router.get("/{bovino_id}", response_model=BovinoPublico)
def buscar(bovino_id: int,
           usuario: Usuario = Depends(get_current_user),
           db: Session = Depends(get_db)):
    return service.buscar(db, bovino_id, usuario)

@router.patch("/{bovino_id}", response_model=BovinoPublico)
def atualizar(bovino_id: int,
              dados: BovinoAtualizar,
              usuario: Usuario = Depends(get_current_user),
              db: Session = Depends(get_db)):
    return service.atualizar(db, bovino_id, dados.model_dump(exclude_unset=True), usuario)

@router.delete("/{bovino_id}", status_code=204)
def apagar(bovino_id: int,
           usuario: Usuario = Depends(get_current_user),
           db: Session = Depends(get_db)):
    return service.excluir(db, bovino_id, usuario)
