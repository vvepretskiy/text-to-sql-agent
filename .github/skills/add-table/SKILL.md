---
name: add-table
description: 'Add a new SQLite table to the text-to-sql agent. Use when adding a table, new entity, new schema, or extending the data model.'
argument-hint: 'Describe the new table (name, columns, relationships)'
---

# Add Table

Adds a new table to the SQLite database and wires it into the agent so the LLM can query it.

## When to Use

- Adding a new entity to the data model (e.g. `product`, `review`, `address`)
- Extending the schema with a new table that the agent should be aware of

## Procedure

### 1. Define the schema — `src/core/constants.ts`

Add a new exported `const` with the `CREATE TABLE IF NOT EXISTS` statement. Follow the existing pattern:

```ts
export const productTable = `
CREATE TABLE IF NOT EXISTS 'product' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' TEXT NOT NULL,
    'price' REAL NOT NULL
);`;
```

- Use single quotes around table and column names inside the SQL string
- Export the constant so it can be imported elsewhere

### 2. Register the table in the database — `src/core/database.ts`

Import the new constant and call `db.run(newTable)` inside the `db.serialize()` block in the `seed()` function, alongside the existing table creation calls.

### 3. Expose the schema to the LLM — `src/core/actions.ts`

1. Import the new constant from `./constants`
2. Append `\n${newTable}` to the `description` string of `dbTool`:

```ts
description: `Get data from a database with the following schema:\n\n${orderTable}\n${customerTable}\n${productTable}`,
```

This is how the agent learns the table exists and can generate correct SQL for it.

### 4. Add seed data — `src/core/database.ts`

Inside `db.serialize()`, after the `db.run(newTable)` call, add a `REPLACE INTO` statement with representative rows so the agent has data to query during development.

### 5. Update documentation

- Add the new table to the **Data Model** section of `CLAUDE.md` and `AGENTS.md` with its columns and any foreign key relationships.

## Checklist

- [ ] Schema constant exported from `constants.ts`
- [ ] `db.run(newTable)` added to `database.ts` seed
- [ ] Constant appended to `dbTool` description in `actions.ts`
- [ ] Seed rows added
- [ ] `CLAUDE.md` and `AGENTS.md` Data Model sections updated
