---
name: schematify-graphs
description: Edit or author Schematify graph TypeScript scripts using the graph/node/channel builder API. Use when modifying existing graph scripts, adding nodes/links/channels, wiring dynamic values, or sending channel updates.
---

# Schematify Graphs

Use Schematify graph scripts for Schematify diagrams; do not substitute Mermaid/DOT/other formats. For CLI commands/flags use the **schematify-cli** skill and `schematify --help`. For generation from source material use **schematify-generate**.

## Core graph-script rules

- Scripts run in a sandbox: no `import`, `require`, Node APIs, or filesystem access.
- Use `async function main() { ... }` and call `main()`; do not rely on top-level `await`.
- Create documents with `graph(uuid)`, nodes with `node(id)`, links with `.links([...])`, then `await doc.publish()`.
- Node paths are ancestor ids joined with `/`. Links must target absolute paths from the graph root, e.g. `"backend/api"`, not relative paths.
- Keep node ids stable when editing; links and publishers depend on ids.
- When editing an existing script, first read it and preserve the graph id unless the user explicitly asks for a new diagram.
- Match the existing style and make the smallest structural change that satisfies the request.

## Static design diagrams vs live graphs

Most architecture, schema, design, and documentation diagrams are **static**. For static diagrams:

- Do **not** add `channels(...)`, `.status(...)`, status badges, `from.channel(...)`, or `channelPublisher(...)`.
- Use static `.attributes(...)`, `.description(...)`, and links to show ownership, dependencies, flows, and structure.
- Keep normal architecture components as normal icon nodes: services, APIs, databases, queues, actors, containers, external systems.
- Use non-default rendering only when it communicates a specific shape. Do not turn ordinary services/infrastructure into report cards.

Use channels/status/publishers only when the user asks for a live/monitoring/telemetry graph or for dynamic channel updates.

## Render style rules

- Default render: use for almost all services, APIs, databases, queues, actors, containers, and external systems.
- `report`: use sparingly for table-like or record-like information: database table definitions, compact configuration records, explicit reports/dashboards. Not for ordinary services by default.
- `property`: use for a small scalar fact attached to a parent, not for every field in a schema.
- Chart styles: use only when the user asks for chart-like data presentation and the necessary params/values are available.

## Relational database schema style

When drawing a relational database schema:

- Keep surrounding architecture context unless the user asks for a schema-only diagram.
- Model the database as `databases/postgres`, `databases/mysql`, or `databases/default`.
- Model each table as a `databases/table` wrapper node.
- Put ordinary columns on one nested report-style `Table Definition` node using attributes and `render.params.attributeIds`.
- Do not create one child node per column.
- Add child nodes under a table only for meaningful substructure: indexes, triggers, partitions, views, constraints as separate objects, or separate logical reports.
- Link tables for logical relationships: foreign-key-like dependencies, join tables, outbox/event flows, deduplication, or ownership.

Preferred table pattern:

```typescript
node("accounts")
  .label("Accounts Table")
  .type("databases/table")
  .children([
    node("definition")
      .label("Table Definition")
      .type("databases/table")
      .render({
        style: "report",
        params: { attributeIds: ["account_key", "user_id", "org_id"] },
      })
      .attributes({
        account_key: "TEXT PRIMARY KEY",
        user_id: "TEXT NOT NULL",
        org_id: "TEXT NOT NULL",
      }),
  ])
```

## Pulled document structure

In pulled Schematify documents:

- Top-level `label` is the diagram title.
- Top-level `description` is the diagram description.
- Node `label` is the node title.
- Node `attributes.description` is the node description field.
- The node tree is under top-level `root`.

## Validation and publishing safety

- Inspect `schematify dry-run --help` and `schematify run --help` before relying on flags.
- Validate scripts with `schematify dry-run <script>` first; dry-run performs no server writes.
- `schematify run <script>` publishes to the server. Only run it when the user asks to publish/update remotely.
- Bound looping scripts with `--max-duration` when validating or publishing.

## Lazy references

Read only when needed:

- Node type ids and render styles: [references/node-types.md](references/node-types.md)
- Exact builder methods and sandbox globals: [references/api-reference.md](references/api-reference.md)
- Channel publishing, dry-run/publish behavior, and loops: [references/channels-publishing.md](references/channels-publishing.md)
- Minimal runnable script: [examples/minimal.ts](examples/minimal.ts)
