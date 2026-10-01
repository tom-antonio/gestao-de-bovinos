from . import repository
from .erros import (
    ErroDeBovino,
    ErroDeVacaNaoEncontrada,
    ErroDeVacaJaExiste,
    ErroDeVacaInvalida,
)

def listar(db, usuario, nome=None, status=None):
    return repository.listar(db, usuario.id, nome, status)


def buscar(db, bovino_id, usuario):
    bovino = repository.buscar(db, bovino_id)
    if bovino is None or bovino.dono_id != usuario.id:
        raise ErroDeVacaNaoEncontrada(f"Vaca {bovino_id} nao esta no banco de dados")
    return bovino


def criar(db, dados, usuario):
    # RN01: Duas vacas ou mais com o mesmo nome nao podem existir.
    if repository.buscar_por_nome(db, usuario.id, dados["nome"]):
        raise ErroDeVacaJaExiste(f"Ja existe uma vaca chamada {dados['nome']}")
    return repository.criar(db, {**dados, "dono_id": usuario.id})


def atualizar(db, bovino_id, mudancas, usuario):
    bovino = buscar(db, bovino_id, usuario)

    novo_nome = mudancas.get("nome")
    if novo_nome and novo_nome != bovino.nome:
        if repository.buscar_por_nome(db, usuario.id, novo_nome):
            raise ErroDeVacaJaExiste(f"Ja existe uma vaca chamada {novo_nome}")

    return repository.atualizar(db, bovino, mudancas)

def excluir(db, bovino_id, usuario):
    bovino = buscar(db, bovino_id, usuario)
    if not bovino.status:
        raise ErroDeVacaInvalida(f"Vaca {bovino_id} nao pode ser excluida")
    repository.excluir(db, bovino)