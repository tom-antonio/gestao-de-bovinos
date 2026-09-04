import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

load_dotenv()

# Se a variavel de ambiente NAO estiver definida, o programa vai falhar
# na hora de criar a conexao com o banco.
URL = os.environ["DATABASE_URL"]

# O SQLite recusa ser usado de uma thread diferente da que abriu a
# conexao, e o FastAPI atende cada rota sincrona numa thread do pool.
# Esta e a UNICA linha do projeto que sabe qual banco esta' rodando -
# quando a URL vira postgresql://, ela some sozinha.
ARGS = {"check_same_thread": False} if URL.startswith("sqlite") else {}

engine = create_engine(URL, connect_args=ARGS)
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    """Todas as tabelas herdam daqui. E assim que o SQLAlchemy
    descobre quais existem.
    """


def get_db():
    """Uma sessao por requisicao, fechada mesmo se der erro."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
