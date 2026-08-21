from pydantic import BaseModel, Field


class BovinoCriar(BaseModel):
    nome: str = Field(min_length=2)
    raca: str = Field(min_length=2)
    nome_mae: str = Field(min_length=2)

class BovinoPublico(BaseModel):
    id: int
    nome: str
    raca: str
    nome_mae: str

class BovinoAtualizar(BaseModel):
    nome: str | None = None
    raca: str | None = None
    nome_mae: str | None = None