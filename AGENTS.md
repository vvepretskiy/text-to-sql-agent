# Text-to-SQL Agent — Project Guidelines

## Stack

- Next.js 15 (App Router) with TypeScript
- LangGraph + LangChain + Ollama (chat model, zero temperature)
- SQLite3 (local demo database via `src/core/database.ts`)
- Tailwind CSS
- Vitest for testing

## Architecture

- `src/core/actions.ts` — server action that builds the LangGraph ReAct agent and handles LLM calls
- `src/core/constants.ts` — SQL schema definitions and system prompt
- `src/core/database.ts` — SQLite query execution
- `src/core/chat-view-model.ts` — maps stored messages to UI-friendly shapes
- `src/components/chat-message.tsx` — renders individual chat messages
- `src/utils/format-message-content.ts` — formats raw LLM content for display

## Build and Test

```bash
npm install          # install dependencies
npm run dev          # start dev server
npm run build        # production build
npm run start        # start on port 3001
npm run test         # run tests once
npm run test:watch   # watch mode
npm run lint         # ESLint
npm run seed         # seed the SQLite database
```

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `OLLAMA_BASE_URL` | Ollama server URL | `http://localhost:11434` |
| `OLLAMA_MODEL` | Model name | `qwen3-coder:30b` |

Copy `.env.sample` → `.env` to get started.

## Data Model

**`customer`** — `id` (PK), `email`, `name`

**`order`** — `id` (PK), `createdate` (TEXT, ISO date), `shippingcost` (REAL), `customerid` (FK → customer), `carrier`, `trackingid`

`order.customerid` references `customer.id`. Always quote table and field names in SQL.

## Linting

- Config: `eslint.config.mjs` (ESLint flat config)
- Extends: `next/core-web-vitals` + `next/typescript`
- Run: `npm run lint`
- Do not disable lint rules inline (`eslint-disable`) without a comment explaining why
- **When writing code, follow ESLint rules proactively** — no unused variables, no `any` types, no missing React keys, consistent import order
- **After every code change, run `npm run lint` and fix all reported errors before finishing**

## Conventions

- All LLM/database calls live in `src/core/actions.ts` as a Next.js server action (`"use server"`)
- SQL field and table names must be wrapped in double quotes (`"`) per the system prompt
- Tests live alongside source files (`*.test.ts`)
- No separate `__tests__` directories
