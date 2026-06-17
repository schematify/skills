---
name: schematify-graphs
description: Author Schematify graphs as scriptable TypeScript using the graph/node/channel builder API, run them safely, and publish live channel data. Use when writing or running a Schematify graph script, calling `schematify run`, building a graph in code, defining nodes/links/channels, wiring dynamic values, or publishing channel updates and polling loops.
---

# Schematify Graphs (scriptable)

Schematify graphs are authored as **TypeScript** and executed with `schematify run <script>`. The script builds a graph with a fluent builder API (`graph`/`node`/`channel`), publishes it, and can push live data through a channel publisher — including in a loop.

This skill is the **how to author** layer. For operating the CLI itself, see the `schematify-cli` skill. For turning a codebase or dataset *into* a graph, see the `schematify-generate` skill.

## Source of truth

The builder API is owned by the CLI. **Confirm the current surface before authoring** rather than trusting memory:

```bash
schematify run --help        # run flags and safety behavior
```

The condensed API in this skill ([references/api-reference.md](references/api-reference.md)) is a snapshot of the v0.2.x builder. If the CLI exposes type definitions or a docs command, prefer that.

## Quick start

A graph script builds a document and publishes it. The `id` passed to `graph()` must be a UUID.

```typescript
async function main() {
  const doc = graph("a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
    .label("My Platform")
    .children([
      node("api").label("API Gateway").type("microservices/load-balancer").links(["db"]),
      node("db").label("Database").type("microservices/database"),
    ]);

  await doc.publish();
}

main();
```

Scripts run in a sandboxed isolate: **no `import`, `require`, Node builtins, or filesystem**. The sandbox injects a focused set of globals (`graph`, `node`, `channel`, `from`, `channelPublisher`, `env`, `fetch`, `console`, timers). Top-level `await` is not supported — wrap async work in `main()` and call it.

## Running safely

`schematify run` is **capture-by-default** — nothing reaches the server unless you pass `--live`. Capture splits two distinct things:

- **The graph document** (`.publish()`) is written to `--out` as a **real Schematify document JSON** — the validatable, pushable artifact (default `~/.schematify/generations/<script>.json`). It is overwritten each run, not appended.
- **Channel values** (`channelPublisher.send()`) are *not* part of the document — they are transient live data. In capture mode they are streamed to an **adjacent sidecar** `<out>.channels.ndjson` and echoed to stdout as a preview, never written into the document file.

```bash
schematify run graph.ts                          # safe: writes the document JSON, no server writes
schematify validate <out>.json                   # the captured document is valid Schematify format
schematify run graph.ts --live                   # real publish (confirms / overwrites server)
```

**The authoring loop:**

1. Write the script.
2. `schematify run graph.ts` — writes the document to `--out`; inspect it (and `schematify validate` it).
3. Fix and re-run until the captured document is what you intend.
4. **Only on explicit user instruction**, `schematify run graph.ts --live`.

`--live` overwrites any existing graph with the same `id` on the server. Treat it as a deliberate, user-initiated act — never publish live by default. Confirm the exact flag behavior with `schematify run --help`.

## Running scripts that loop

A script that calls `setInterval` to publish channel updates **runs forever** — it will not return on its own. When running such a script for validation, bound it so it terminates:

```bash
schematify run graph.ts --max-publishes 3        # stop after 3 channel updates
schematify run graph.ts --max-duration 5s        # stop after 5 seconds
```

`--max-publishes` counts **channel updates** (the loop), not the one-time document publish. Inspect the `.channels.ndjson` sidecar to confirm the loop emits the right values. (Bounds are opt-in; without them a finite script runs to completion and a loop runs until interrupted.)

## Inspect without running

To see the compiled document structure without any publish path at all, use `.compile()` in the script instead of `.publish()`:

```typescript
console.log(JSON.stringify(doc.compile(), null, 2));   // requires --debug to surface output
```

## References

- **API reference** — `graph`/`node`/`channel`/`from`/`channelPublisher`, all methods: [references/api-reference.md](references/api-reference.md)
- **Channels & publishing** — live data, `channelPublisher`, polling loops, capture vs live: [references/channels-publishing.md](references/channels-publishing.md)
- **Examples** — runnable scripts: [examples/minimal.ts](examples/minimal.ts), [examples/with-channels.ts](examples/with-channels.ts), [examples/publish-loop.ts](examples/publish-loop.ts)
