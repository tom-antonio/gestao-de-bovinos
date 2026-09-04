from . import repository
from .erros import (
    ErroDeBovino,
    ErroDeVacaNaoEncontrada,
    ErroDeVacaJaExiste,
    ErroDeVacaInvalida,
)

def listar(db):
    return repository.listar(db)


def buscar(db, bovino_id):
    bovino = repository.buscar(db, bovino_id)
    if bovino is None:
        raise ErroDeVacaNaoEncontrada(f"Vaca {bovino_id} nao esta no banco de dados")
    return bovino


def criar(db, dados):
    # RN01: Duas vacas ou mais com o mesmo nome nao podem existir.
    if repository.buscar_por_nome(db, dados["nome"]):
        raise ErroDeVacaJaExiste(f"Ja existe uma vaca chamada {dados['nome']}")
    return repository.criar(db, dados)


def atualizar(db, bovino_id, mudancas):
    bovino = buscar(db, bovino_id)

    novo_nome = mudancas.get("nome")
    if novo_nome and novo_nome != bovino.nome:
        if repository.buscar_por_nome(db, novo_nome):
            raise ErroDeVacaJaExiste(f"Ja existe uma vaca chamada {novo_nome}")

    return repository.atualizar(db, bovino, mudancas)

def excluir(db, bovino_id):
    bovino = buscar(db, bovino_id)
    if not bovino.status:
        raise ErroDeVacaInvalida(f"Vaca {bovino_id} nao pode ser excluida")
    repository.excluir(db, bovino)