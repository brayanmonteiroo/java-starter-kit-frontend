# Java Starter Kit Frontend — Agent Guide

## Stack

- Angular 22 (standalone) + Tailwind v4 + TailAdmin free
- API: `environment.apiUrl` → backend `http://localhost:8098/api`
- Auth: JWT Bearer + refresh (`AuthService`, `authInterceptor`, `authGuard`)

## Estrutura

- `core/api` — HTTP, auth, admin API
- `pages/admin` — dashboard, users, roles, audits
- `pages/auth-pages` — login, forgot, reset
- Layout/shell TailAdmin em `layout/`

## Comandos

```bash
# Docker (recomendado — docs.docker.com/guides/angular)
docker compose -f compose.dev.yaml up --build --watch

# Host (opcional)
npm ci
npm start
npm run build
```

Docker: `Dockerfile.dev` + Compose Watch (sync, ignore `node_modules`). Produção: `Dockerfile` multi-stage + Nginx unprivileged (`compose.yaml`).

## Convenções

- Preferir componentes standalone.
- Novas telas de produto em `pages/admin` (ou feature folder), não espalhar demos TailAdmin no menu.
- Commits em português (Conventional Commits).
