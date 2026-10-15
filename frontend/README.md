# Frontend

O frontend Flutter depende da API FastAPI. O `flutter run` não inicia o
backend automaticamente: mantenha o Uvicorn rodando em outro terminal.

## Executar localmente

No primeiro uso, prepare o backend:

```bash
cd ../backend
poetry install
poetry run alembic upgrade head
```

No terminal 1, inicie a API e deixe esse terminal aberto:

```bash
cd ../backend
poetry run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Confirme que ela está disponível em <http://127.0.0.1:8000/docs>.

No terminal 2, compile e execute o frontend:

```bash
cd frontend
flutter pub get
flutter run -d web-server --web-port 8080 \
  --dart-define=API_BASE_URL=http://127.0.0.1:8000
```

Abra o endereço informado pelo Flutter, normalmente
<http://localhost:8080>. Se o terminal do Uvicorn for encerrado, o login e o
cadastro deixarão de funcionar.

O endereço padrão da API também é `http://127.0.0.1:8000`; o
`--dart-define` permite apontar o frontend para outro endereço sem alterar o
código.
