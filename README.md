# Invoice App

Full-stack приложение для учёта клиентов и счетов: Vue 3, Node.js (Koa), PostgreSQL.

## Стек

- **Frontend:** Vue 3 (Composition API, `<script setup>`), TypeScript, Vue Router, Pinia, SCSS, Vite
- **Backend:** Node.js, Koa, TypeScript, zod
- **Database:** PostgreSQL 16 (Docker)
- **Tooling:** ESLint, Prettier, Conventional Commits

## Запуск

1. Запустите Docker Desktop.
2. База данных (из корня проекта):
```bash
   docker compose up -d
```
3. Бэкенд (http://localhost:3000):
```bash
   cd backend && npm install && npm run dev
```
4. Фронтенд (http://localhost:5173):
```bash
   cd frontend && npm install && npm run dev
```

Фронтенд проксирует `/api/*` на бэкенд (настройка в `frontend/vite.config.ts`).

## API

| Метод | Путь | Описание |
|---|---|---|
| GET | `/health` | проверка работоспособности |
| GET | `/clients` | список клиентов |
| POST | `/clients` | создать клиента (валидация zod, 409 при повторе ИНН) |
| GET | `/invoices?limit=&offset=` | список счетов с пагинацией |
| GET | `/invoices/:id` | счёт с клиентом, позициями и суммой |
| POST | `/invoices` | создать счёт с позициями в одной транзакции |

## Что реализовано

- Схема БД с внешними ключами, `CHECK`-ограничениями, `NUMERIC` для денег, индексом по `invoices.client_id`
- Создание счёта и позиций в одной транзакции с откатом при ошибке
- Единая обработка ошибок и логирование через middleware
- Ошибки ограничений БД превращаются в 409 и 422
- Список клиентов с поиском на фронтенде
- Список счетов с серверной пагинацией
