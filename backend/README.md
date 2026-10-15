# Gestão de Bovinos — sistema de cadastro de bovinos
O projeto com login e migrações, mais o que o checkpoint pede: o bovino
ganha **dono** (um usuário tem muitos bovinos), cada pessoa enxerga e mexe só
no próprio quantitativo de bovinos cadastrados, a listagem tem **busca e filtro**, e o `422` explica o
que está errado em português. A coluna nova entrou por uma **migração** —
o `create_all` não existe mais.

## Como rodar a API

Instale as dependências e aplique as migrações:

```bash
cd backend
poetry install
poetry run alembic upgrade head
```

Inicie a API e mantenha este terminal aberto:

```bash
poetry run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Ela deve responder em <http://127.0.0.1:8000/> e a documentação fica em
<http://127.0.0.1:8000/docs>.

## Como rodar o frontend

Em outro terminal, suba o Flutter:

```bash
cd frontend
flutter pub get
flutter run -d web-server --web-port 8080 \
  --dart-define=API_BASE_URL=http://127.0.0.1:8000
```

O `alembic upgrade head` aplica as **duas** migrações: a que cria `bovinos` e
`usuarios`, e a que acrescenta `bovinos.dono_id`. Depois abra
<http://127.0.0.1:8000/docs>.

As telas têm nome (`lib/routes.dart`) e o `main.dart` liga cada nome à tela. As telas de dentro do app passam pelo `RotaProtegida`: sem sessão, mostram o login.

A sessão (`SessaoService`) fica no topo do app, num `ChangeNotifierProvider`, e as telas a leem com `context.read` e `context.watch`: nenhuma recebe a sessão pelo construtor. O token vive só na memória: recarregar a página (F5) sai do app.
