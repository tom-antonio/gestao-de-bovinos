from pydantic import BaseModel, Field, field_validator
from pydantic import BaseModel, ConfigDict, Field

def _nome_bovino(bovino: str) -> str:
    # A mensagem e' para quem le a resposta 422: diz o que fazer, nao o que
    # o validador se chama.
    if len(bovino.strip()) < 2:
        raise ValueError("o nome do bovino precisa ter pelo menos 2 caracteres")
    return bovino.strip()

class BovinoCriar(BaseModel):
    nome: str = Field(min_length=3)
    raca: str = Field(min_length=3)
    nome_mae: str = Field(min_length=3)
    status: bool = Field(default=True)

    @field_validator("nome", mode="before")
    def validar_nome(cls, nome: str) -> str:
        return _nome_bovino(nome)
    @field_validator("raca", mode="before")
    def validar_raca(cls, raca: str) -> str:
        return _nome_bovino(raca)
    @field_validator("nome_mae", mode="before")
    def validar_nome_mae(cls, nome_mae: str) -> str:
        return _nome_bovino(nome_mae)

class BovinoPublico(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nome: str
    raca: str
    nome_mae: str
    status: bool
    dono_id: int | None 

class BovinoAtualizar(BaseModel):
    nome: str | None = None
    raca: str | None = None
    nome_mae: str | None = None
    status: bool | None = None

    @field_validator("nome", mode="before")
    def validar_nome(cls, nome: str) -> str:
        return _nome_bovino(nome)
    @field_validator("raca", mode="before")
    def validar_raca(cls, raca: str) -> str:
        return _nome_bovino(raca)
    @field_validator("nome_mae", mode="before")
    def validar_nome_mae(cls, nome_mae: str) -> str:
        return _nome_bovino(nome_mae) 