# Dashboard Unifor

Sistema de agendamento com dashboard integrado, backend em [Bun + Elysia](https://elysiajs.com) e frontend com [Preact](https://preactjs.com) via CDN.

## Estrutura do Projeto

```
dashboard-unifor/
├── backend/          # API com Elysia + SQLite (libSQL)
│   └── index.ts
├── frontend/         # Interface web com Preact + Bootstrap via CDN
│   └── index.html
└── .gitignore
```

## Requisitos

- [Bun](https://bun.sh) instalado (v1.0 ou superior)

> Para instalar o Bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Instalação dos pacotes

No diretório do projeto, instale os pacotes do backend:

```bash
cd backend
bun install
```

Isso instalará:

- `elysia`
- `@elysiajs/cors`
- `@elysiajs/swagger`
- `@libsql/client`

Você também pode instalar manualmente com:

```bash
bun add elysia @elysiajs/cors @elysiajs/swagger @libsql/client
```

## Como rodar o projeto

### 1. Iniciar o backend

```bash
bun run index.ts
```

O servidor será iniciado em `http://localhost:3001`.

### 2. Abrir o frontend

Abra o arquivo `frontend/index.html` diretamente no navegador (`file://...`) ou use uma extensão como "Live Server" no VS Code para visualização.

## Endpoints da API

- `GET    /usuarios`
- `POST   /usuarios`
- `PUT    /usuarios/:id`
- `DELETE /usuarios/:id`

- `GET    /agendamentos`
- `POST   /agendamentos`
- `PUT    /agendamentos/:id`
- `DELETE /agendamentos/:id`

Swagger disponível em `http://localhost:3001/swagger`

## Banco de Dados

O banco `agendamentos.db` é criado automaticamente com dados mock:

- 3 usuários iniciais
- 3 agendamentos de exemplo

## Tecnologias

- Bun
- Elysia
- libSQL (SQLite compatível)
- Swagger
- Preact
- Bootstrap
