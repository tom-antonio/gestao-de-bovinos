# Gestão de Bovinos — sistema de cadastro de bovinos
O projeto com login e migrações, mais o que o checkpoint pede: o bovino
ganha **dono** (um usuário tem muitos bovinos), cada pessoa enxerga e mexe só
no próprio quantitativo de bovinos cadastrados, a listagem tem **busca e filtro**, e o `422` explica o
que está errado em português. A coluna nova entrou por uma **migração** —
o `create_all` não existe mais.

## Como rodar o app
Suba a API antes (ela precisa estar na porta 8000).
```
cd frontend
flutter pub get
flutter run -d chrome
```

O `upgrade head` aplica as **duas** migrações: a que cria `bovinos` e
`usuarios`, e a que acrescenta `bovinos.dono_id`. Depois abra
<http://127.0.0.1:8000/docs>.