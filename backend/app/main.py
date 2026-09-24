from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from .bovino import controller as bovino_controller
from .bovino.erros import ErroDeBovino, ErroDeVacaNaoEncontrada
from .usuarios import controller as usuarios_controller
from .usuarios.erros import CredenciaisInvalidas, ErroDeUsuario

# A instancia da aplicacao. O titulo aparece na pagina /docs.
app = FastAPI(title="API do Meu Projeto", version="0.1.0")
app.include_router(usuarios_controller.router)
app.include_router(bovino_controller.router)

@app.exception_handler(ErroDeBovino)
def erro_de_bovino_handler(request: Request, erro: ErroDeBovino):
    """O unico lugar do sistema que transforma recusa em numero HTTP."""
    codigo = 404 if isinstance(erro, ErroDeVacaNaoEncontrada) else 409
    return JSONResponse(status_code=codigo, content={"detail": str(erro)})

@app.exception_handler(ErroDeUsuario)
def erro_de_usuario_handler(request: Request, erro: ErroDeUsuario):
    codigo = 401 if isinstance(erro, CredenciaisInvalidas) else 409
    return JSONResponse(status_code=codigo, content={"detail": str(erro)})

# O decorador diz: "esta funcao atende GET na raiz".
@app.get("/")
def raiz():
    # Devolvemos um dicionario. O FastAPI transforma em JSON sozinho.
    return {"mensagem": "A API do meu projeto esta no ar!"}