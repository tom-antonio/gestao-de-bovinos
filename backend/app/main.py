from fastapi import FastAPI
from .database import Base, engine
from .bovino import controller as bovino_controller

# A instancia da aplicacao. O titulo aparece na pagina /docs.
app = FastAPI(title="API do Meu Projeto", version="0.1.0")
app.include_router(bovino_controller.router)
Base.metadata.create_all(bind=engine)


# O decorador diz: "esta funcao atende GET na raiz".
@app.get("/")
def raiz():
    # Devolvemos um dicionario. O FastAPI transforma em JSON sozinho.
    return {"mensagem": "A API do meu projeto esta no ar!"}