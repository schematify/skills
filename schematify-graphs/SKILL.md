---
name: schematify-graphs
description: Edit or author Schematify TypeScript graph scripts with the graph, node, and channel builder API. Use for graph structure, links, live values, and updates to existing source scripts.
---

# Schematify graphs

Schematify graph scripts define a graph document and publish it through the CLI runner. Use **schematify-cli** for commands and flags, **schematify-generate** when deriving a graph from source material, and **schematify-render** for `.render(...)`.

## Graph terms

- A **graph document** has a UUID, label, optional description, and root node collection.
- A **node id** identifies a node among its siblings.
- A **node path** joins ancestor ids with `/`, such as `backend/api`. It is root-relative and never starts with `/`.
- An **attribute** is static metadata published with the graph document.
- A **channel** is a named value slot that can receive new values after the graph is published.

## Core script rules

- Scripts run in a sandbox without `import`, `require`, Node APIs, or filesystem access.
- Use `async function main()`, call `main()`, and avoid top-level `await`.
- Create the document with `graph(uuid)`, nodes with `node(id)`, and links with `.links([...])`.
- Link targets are root-relative node paths.
- Finish the document workflow with `await doc.publish()`.
- Keep graph and node ids stable when editing. Links and publishers depend on them.
- Match the existing source style and make the smallest change that satisfies the request.

## Editing local source

When the task creates or maintains a TypeScript graph script, use that script as the authoring source:

1. Read the target script.
2. Edit that script directly.
3. Validate it with `schematify dry-run`.
4. Publish only when the user asks.

The server stores a JSON graph document and can receive independent edits. Do not replace local source with pulled JSON or inspect unrelated published graphs for examples. If the user asks to reconcile server-side changes, pull that specific graph, compare it with the source script, and resolve the difference explicitly.

If the user identifies the faulty field or supplies the correction, apply it to the source before doing more research. Read only the local reference needed to confirm syntax or behavior.

## Static and live data

Most architecture, schema, design, and documentation graphs are static.

For a static graph:

- Put facts in attributes.
- Omit channels, publishers, and status bindings.
- Use ordinary node types for services, APIs, databases, queues, actors, containers, and external systems.
- Use specialized rendering only when it communicates a scalar value, compact record, or chart.

Live data means a value can change after the graph document is published. Define a `channel(...)` on the node, then use `channelPublisher(doc.id)` to send replacement values to that channel. A status or render parameter can read the current value with `from.channel(...)`. Channel updates change values, not graph structure.

Use live data only when the user asks for monitoring, telemetry, status updates, polling, or another ongoing update flow. Read [references/channels-publishing.md](references/channels-publishing.md) before implementing it.

## Specialized rendering

Use default rendering for ordinary nodes. Load **schematify-render** before using property, report, pie chart, bar chart, or line chart styles. That skill defines each style's parameters, bindings, and sizing behavior.

For a relational database schema, read [references/database-schema.md](references/database-schema.md).

## Pulled graph documents

In JSON returned by `schematify pull`:

- top-level `label` is the diagram title,
- top-level `description` describes the diagram,
- node `label` is the node title,
- node `attributes.description` is the node description,
- the node tree is under top-level `root`.

Use pulled JSON to inspect published state. Do not treat it as a replacement for an existing TypeScript source script unless the user explicitly chooses that direction.

## Validation and publishing

- Check `schematify dry-run --help` and `schematify run --help` before using flags.
- Run `schematify dry-run <script>` before publishing. It performs no server writes.
- Dry-run validates structure and renderer configuration. It does not prove that text fits or that the rendered proportions are readable.
- Run `schematify run <script>` only when the user asks to publish. Publishing an existing graph id can overwrite the server document.
- Bound scripts with active loops using the duration option supported by the installed CLI.

## References

Read only what the task needs:

- Builder methods and sandbox globals: [references/api-reference.md](references/api-reference.md)
- Node types and status badge ids: [references/node-types.md](references/node-types.md)
- Live channels, publishing, and loops: [references/channels-publishing.md](references/channels-publishing.md)
- Relational database schemas: [references/database-schema.md](references/database-schema.md)
- Minimal static script: [examples/minimal.ts](examples/minimal.ts)
