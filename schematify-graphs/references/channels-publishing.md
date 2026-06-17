# Channels & Live Publishing

> Snapshot of the v0.2.x live-data workflow. Confirm `schematify run` flags with `schematify run --help`.

## Contents

- The two halves: structure vs live values
- Defining channels
- Pushing values with `channelPublisher`
- Polling loops
- Capture vs live, and bounding loops

## The two halves

A scriptable graph has two distinct concerns:

1. **Structure** — nodes, links, attributes, and *channel definitions*. Established once with `graph(...).publish()`.
2. **Live values** — the actual data flowing into those channels over time. Pushed with `channelPublisher`, repeatedly if you want a live graph.

Channels are the slots; the publisher fills them.

## Defining channels

Declare channels on the nodes that carry live data, with a default for before any value arrives:

```typescript
node("server")
  .label("Server")
  .channels([
    channel("cpu").label("CPU").default("—"),
    channel("mem").label("Memory").default("—").staleAfter(5000),
  ])
  .status({ type: from.channel("status") });
```

`staleAfter` (on the graph or per-channel) controls when a value is considered stale if no fresh value arrives.

## Pushing values with `channelPublisher`

After the graph is published, bind a publisher to its id and set values by **node path**:

```typescript
const pub = channelPublisher(doc.id);

pub.set("server", { cpu: "45%", mem: "60%" });   // top-level node
pub.set("server/disk", { usage: "82%" });         // nested node, path uses "/"

const result = await pub.send();                  // one request for all buffered patches
// result: { status: "delivered" } | { status: "dropped", reason: "..." }
```

- `.set()` is a **local buffer** — repeated calls to the same path merge keys; no network happens until `.send()`.
- `.send()` flushes everything buffered in a **single** request and clears the buffer on success.

## Polling loops

To keep a graph live, fetch data and publish on an interval. The interval keeps the sandbox alive:

```typescript
async function main() {
  await doc.publish();
  const pub = channelPublisher(doc.id);

  async function tick() {
    const res = await fetch("https://metrics.internal/stats");
    const stats = await res.json();
    pub.set("server", { cpu: `${stats.cpu}%`, mem: `${stats.memory}%` });
    await pub.send();
  }

  setInterval(tick, 5000);
  await tick();   // publish immediately, then every 5s
}

main();
```

## Capture vs live, and bounding loops

`schematify run` is **capture-by-default**, and it treats the document and channel values differently because they are different things:

- **`.publish()` (the document):** written to `--out` as a **real Schematify document JSON** — validatable and pushable. Overwritten each run.
- **`.send()` (channel values):** *not* part of the document. Streamed to the **adjacent sidecar** `<out>.channels.ndjson` (one `{schemaId, patches}` object per line, appended) and echoed to stdout as a preview. Never written into the document file, never sent to the server in capture mode.

```bash
schematify run graph.ts                  # document → <out>.json ; channel values → <out>.channels.ndjson + stdout
schematify run graph.ts --live           # real publish: document overwrites the server graph; channel values pushed live
```

A looping script never returns on its own. To validate one, **bound it** so it terminates, then read the sidecar:

```bash
schematify run graph.ts --max-publishes 3    # stop after 3 channel updates
schematify run graph.ts --max-duration 5s    # stop after 5 seconds
```

Both bounds are opt-in and compose — whichever trips first ends the run cleanly. **`--max-publishes` counts channel updates** (the looping `.send()` calls), not the one-time document publish — so `--max-publishes 3` lets a polling script emit three channel updates to the sidecar, then exits.

The document file is overwritten per run, so it always reflects the current script. The channel sidecar is appended (it's an event stream); delete it or use a fresh `--out` if you want only the current run's updates.

**Workflow:** run in capture mode (bounded if it loops) → inspect the NDJSON → only on explicit user instruction, re-run with `--live`. Going live overwrites any existing graph with the same `id`; confirm the exact flag behavior with `schematify run --help`.
