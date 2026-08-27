# Relational database schema

Use this pattern when the graph describes relational tables and their relationships.

- Keep surrounding architecture when it helps explain ownership or data flow. Omit it when the user asks for a schema-only graph.
- Model the database with `databases/postgres`, `databases/mysql`, or `databases/default`.
- Model each table as a `databases/table` wrapper node.
- Put ordinary columns in one nested report node. Reports self-size from their row ids and values.
- Add separate child nodes only for meaningful objects such as indexes, triggers, partitions, views, or constraints.
- Link tables for foreign keys, join tables, outbox flows, deduplication, or another observed relationship.

Load **schematify-render** for the report configuration.

```typescript
node("accounts")
  .label("Accounts table")
  .type("databases/table")
  .children([
    node("definition")
      .label("Table definition")
      .type("databases/table")
      .attributes({
        account_key: "TEXT PRIMARY KEY",
        user_id: "TEXT NOT NULL",
        org_id: "TEXT NOT NULL",
      })
      .render({
        style: "report",
        params: {
          attributeIds: ["account_key", "user_id", "org_id"],
        },
      }),
  ])
```

Do not create one child node per ordinary column. That turns a compact table definition into unnecessary graph structure.
