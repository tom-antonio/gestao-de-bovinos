from fastapi import APIRouter, HTTPException, status
from .schemas import BovinoCriar, BovinoPublico, BovinoAtualizar

router = APIRouter(prefix="/bovinos", tags=["Bovinos"])

# Banco de mentira: uma lista em memoria. Vira banco de verdade no encontro 4.
bovinos: list[dict] = []


@router.get("/", response_model=list[BovinoPublico])
def listar():
    return bovinos

@router.get("/bovino")
def listar_bovinos():
    return [{"id": 1, "nome": "Coruja", "raca": "Girolando", "nome_mae": "Pretinha"}]

@router.post("/", response_model=BovinoPublico, status_code=201)
def criar(dados: BovinoCriar):
    novo = {"id": len(bovinos) + 1, **dados.model_dump()}
    bovinos.append(novo)
    return novo

@router.get("/{id}", response_model=BovinoPublico)
def buscar(id: int):
    for b in bovinos:
        if b["id"] == id:
            return b
    raise HTTPException(status_code=404, detail="Bovino nao encontrado")

@router.patch("/{bovino_id}", response_model=BovinoPublico)
def atualizar(bovino_id: int, dados: BovinoAtualizar):
    for p in bovinos:
        if p["id"] == bovino_id:
            p.update(dados.model_dump(exclude_unset=True))
            return p
    raise HTTPException(status_code=404, detail="Bovino nao encontrado")

@router.delete("/{bovino_id}", status_code=204)
def apagar(bovino_id: int):
    for p in bovinos:
        if p["id"] == bovino_id:
            bovinos.remove(p)
            return
    raise HTTPException(status_code=404, detail="Bovino nao encontrado")