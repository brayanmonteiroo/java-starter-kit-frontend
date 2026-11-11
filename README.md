# java-starter-kit-frontend

Painel Angular (TailAdmin free) do starter kit Java. Consome a API hexagonal do backend.

Backend: [java-starter-kit-backend](https://github.com/brayanmonteiroo/java-starter-kit-backend) → http://localhost:8098

Este README orienta como **rodar o front** e entrar no painel. Infra de e-mail (Mailpit), fila (RabbitMQ), Swagger e seed da API estão documentados no **README do backend**.

---

## Pré-requisitos

- Docker + Docker Compose
- Backend já no ar (`compose.dev.yaml` do repo backend)

---

## Setup (dev)

Projeto Compose: `java-starter-kit-frontend` (separado do backend na extensão Docker).

```bash
cp .env.example .env
docker compose -f compose.dev.yaml up --build --watch
```

App: http://localhost:4200

`--watch` sincroniza o código no container (padrão do [guia Angular Docker](https://docs.docker.com/guides/angular/)).

```bash
docker compose -f compose.dev.yaml logs -f web
docker compose -f compose.dev.yaml down
```

---

## Login inicial

O usuário admin é criado pelo **seed do backend** (não pelo front).

| Campo | Valor padrão |
|-------|----------------|
| E-mail | `admin@java-starter.test` |
| Senha | `password` |

Origem no backend: `.env` / `SEED_ADMIN_*` e `bootstrap/DataSeeder.java`.  
Detalhes, Mailpit (forgot-password), RabbitMQ e Swagger → README do backend.

---

## Portas

| Modo | URL |
|------|-----|
| Dev (`compose.dev.yaml`) | http://localhost:4200 |
| Prod local (`compose.yaml`) | http://localhost:8080 |
| API | http://localhost:8098 |

---

## Configuração da API

Em dev, o browser chama a API no host:

`src/environments/environment.ts`

```ts
apiUrl: 'http://localhost:8098/api'
```

---

## Rotas do painel

- `/` — painel
- `/users` — usuários
- `/perfis` — perfis / permissões
- `/audits` — auditoria
- `/signin`, `/forgot-password`, `/auth/reset-password`

---

## Produção (imagem Nginx)

```bash
docker compose -f compose.yaml up --build -d
```

Estáticos na 8080; proxy de `/api/` para `host.docker.internal:8098`.

---

## Sem Docker (opcional)

Node.js **24.15+**:

```bash
npm ci
npm start
```

---

## Stack

- Angular 22 · Tailwind CSS v4 · TailAdmin free
- JWT (interceptor + refresh) · guard de rotas
- `Dockerfile.dev` · `Dockerfile` multi-stage (Nginx unprivileged)
