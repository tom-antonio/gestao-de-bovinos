class ErroDeBovino(Exception):
    """Qualquer recusa de bovino. Quem traduz para HTTP e o controller."""

class ErroDeVacaNaoEncontrada(ErroDeBovino):
    """Exceção lançada quando uma vaca não é encontrada no banco de dados."""

class ErroDeVacaJaExiste(ErroDeBovino):
    """Exceção lançada quando uma vaca já existe no banco de dados."""

class ErroDeVacaInvalida(ErroDeBovino):
    """Exceção lançada quando uma vaca é inválida."""
