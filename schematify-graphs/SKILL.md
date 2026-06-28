---
name: schematify-graphs
description: Edit or author Schematify graph TypeScript scripts using the graph/node/channel builder API. Use when modifying existing graph scripts, adding nodes/links/channels, wiring dynamic values, or sending channel updates.
---

# Schematify Graphs

This is the graph-script layer. For CLI operations and flags, use `schematify --help` / `schematify <command> --help` and the `schematify-cli` skill. For generating graphs from a codebase or dataset, use `schematify-generate`.

Any graph related to Schematify must use Schematify graph scripts only; do not fall back to alternative graph formats.

## Editing existing scripts

1. Read the script before changing it; preserve its graph id unless the user explicitly wants a new graph.
2. Make the smallest structural change that satisfies the request. Match the script's existing builder style, naming, nesting, and channel patterns.
3. Keep node ids stable unless the user is intentionally renaming/replacing a node. Links and publisher paths depend on those ids.
4. For nested nodes, remember that runtime paths are ancestor ids joined with `/`.
5. Links always target absolute node paths from the graph root; never use relative paths.
6. Do not add imports, `require`, Node APIs, or filesystem access; scripts run in the Schematify sandbox.

## Document structure basics

In pulled Schematify documents:

- The diagram/document title is stored in the top-level `label` field.
- The diagram/document description is stored in the top-level `description` field.
- Node titles are stored in each node's `label` field.
- Node attributes are arbitrary key-value metadata. Some attribute keys carry document semantics; `attributes.description` is the node description field.
- The graph node tree is stored under the top-level `root` field.

## Authoring model

A graph script normally:

1. Creates a document with `graph(uuid)`.
2. Adds nodes with `node(id).label(...).type(...).children([...]).links([...])`.
3. Defines live-value slots with `channel(id)` inside `.channels([...])`.
4. Adds links with absolute target paths, e.g. `.links(["backend/api"])`, not paths relative to the source node.
5. Wires display/status values with `from.channel(...)`, `from.attribute(...)`, or `from.value(...)`.
6. Calls `await doc.publish()`.
7. Optionally sends live values with `channelPublisher(doc.id).set(nodePath, values).send()`.

Use `async function main() { ... }` and call `main()`; do not rely on top-level `await`.

## Safety while running

Inspect `schematify run --help` before relying on runner flags or output paths.

Run in the default/capture mode first. Do **not** pass `--live` unless the user explicitly asks for a real publish. A live publish can overwrite the graph with the same id.

Looping scripts keep running; when validating one, bound it with the max-duration/max-publishes flags supported by the installed CLI.

## Lazy references

Read only when needed:

- Node type ids and render styles: [references/node-types.md](references/node-types.md)
- Exact builder methods and sandbox globals: [references/api-reference.md](references/api-reference.md)
- Channel publishing, capture behavior, and loops: [references/channels-publishing.md](references/channels-publishing.md)
- Minimal runnable script: [examples/minimal.ts](examples/minimal.ts)
