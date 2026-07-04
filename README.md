# Text-to-SQL Agent

A Next.js example that uses LangGraph + Ollama to answer natural-language questions by querying a local SQLite database.

## Stack

- Next.js (App Router)
- LangGraph + LangChain
- Ollama (chat model)
- SQLite3 (local demo database)

## Prerequisites

- Node.js 18+
- npm
- Ollama running locally or remotely

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your env file:

```bash
cp .env.sample .env
```

3. Configure environment variables in .env:

- OLLAMA_BASE_URL: URL to your Ollama server (example: http://localhost:11434)
- OLLAMA_MODEL: model name to use (example: qwen3-coder:30b)

If OLLAMA_MODEL is missing, the app returns a clear message from the server action.

## Run

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm run start
```

## Tests

Run all tests once:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Current test coverage includes:

- Chat message content formatting logic
- Chat message view-model mapping logic

## Useful commands

- Lint: npm run lint
- Seed script: npm run seed

## Example prompts

- How many orders are there?
- Return all orders
- Which customers placed the most orders?

## Notes

- Database schema is defined in src/app/database.ts and src/app/constants.ts.
- The UI auto-scrolls to the latest message.
- Message rows are memoized to reduce unnecessary re-renders.
