# Schematify Builder API Reference

> Snapshot of the v0.2.x sandbox builder API. The CLI owns this surface — if `schematify run` exposes type definitions or a docs command, prefer that over this file.

## Contents

- Sandbox globals
- `graph(id)` — graph document builder
- `node(id)` — node builder
- `channel(id)` — channel definition
- `from` — value bindings
- `channelPublisher(schemaId)` — live data publisher
- `fetch`, `env`, timers
- Script lifecycle

## Sandbox globals

Scripts run in a V8 isolate with **no** `require`, `import`, Node builtins, or filesystem. Only these globals are injected:

| Global | Purpose |
|--------|---------|
| `graph(id)` | Create a graph builder (`id` must be a UUID) |
| `node(id)` | Create a node builder |
| `channel(id)` | Create a channel definition |
| `from` | Binding helpers for dynamic values |
| `channelPublisher(schemaId)` | Batch and send live channel data |
| `env` | Environment variables (frozen record of strings) |
| `fetch(url, options?)` | HTTP requests (http/https only) |
| `console` | `log`, `info`, `warn`, `error`, `debug` |
| `setTimeout` / `setInterval` / `clearTimeout` / `clearInterval` | Timers |

## `graph(id)`

Creates a graph document builder. `id` must be a valid UUID and is the graph's stable identity — publishing with an existing id overwrites that graph.

```typescript
const doc = graph("550e8400-e29b-41d4-a716-446655440000")
  .label("My Platform")
  .description("A live infrastructure graph")
  .staleAfter(30000)
  .children([...nodes]);
```

| Method | Description |
|--------|-------------|
| `.label(name)` | Display name |
| `.description(text)` | Human-readable description |
| `.staleAfter(ms)` | Default staleness threshold for channels (ms) |
| `.nodeTypes(packs)` | Custom node type textures |
| `.children(nodes)` | Top-level nodes (array of node builders) |
| `.compile()` | Return the raw document object **without** publishing |
| `.publish()` | Validate, compile, and push to Schematify (async) |
| `.id` | The graph's UUID (use with `channelPublisher`) |

## `node(id)`

Creates a node. IDs must be unique among siblings. A node's **path** is its id joined to ancestors with `/` (e.g. `api-gateway/routes`).

```typescript
node("api-gateway")
  .label("API Gateway")
  .type("microservices/load-balancer")
  .attributes({ region: "us-east-1" })
  .channels([
    channel("status").label("Status").default("base/healthy"),
    channel("latency").label("P95 Latency").default("—"),
  ])
  .status({ type: from.channel("status") })
  .render({
    style: "property",
    params: {
      header: from.channel("latency"),
      "display-value": from.channel("status"),
    },
  })
  .links(["database"])
  .children([...childNodes]);
```

| Method | Description |
|--------|-------------|
| `.label(name)` | Display name |
| `.type(typeId)` | Node type identifier (texture pack id, e.g. `"microservices/service"`) |
| `.attributes(obj)` | Key-value metadata |
| `.channels(channels)` | Channel definitions for this node |
| `.status(config)` | Status binding, `{ type, report? }` |
| `.render(config)` | Render style and parameter bindings |
| `.links(paths)` | Array of target node paths (sibling id or full path) |
| `.children(nodes)` | Nested child nodes |

Node `type` and status values (e.g. `"base/healthy"`) are texture-pack identifiers. The available packs are owned by Schematify; use ids seen in examples or the CLI docs rather than inventing them.

## `channel(id)`

A slot for live values pushed via the channel publisher.

```typescript
channel("cpu").label("CPU Usage").default("—").staleAfter(5000);
```

| Method | Description |
|--------|-------------|
| `.label(name)` | Display name (defaults to the channel id) |
| `.default(value)` | Initial/fallback value |
| `.staleAfter(ms)` | Override the graph-level staleness threshold |

## `from` — value bindings

Connect render params and status to dynamic sources:

```typescript
from.channel("status")     // read from a channel on this node
from.attribute("region")   // read from node attributes
from.value("static text")  // literal/inline value
```

Use inside `.status()` and `.render()` to wire dynamic values into the display.

## `channelPublisher(schemaId)`

Returns a handle for pushing live channel values to an already-published graph. See [channels-publishing.md](channels-publishing.md) for the full live-data workflow.

```typescript
const pub = channelPublisher(doc.id);
pub.set("api-gateway", { status: "base/healthy", cpu: "45%" });
const result = await pub.send();   // { status: "delivered" } | { status: "dropped", reason }
```

| Method | Description |
|--------|-------------|
| `.set(nodePath, channels)` | Buffer channel values for a node path. Repeat calls to the same path merge keys. Local only — no network. |
| `.send()` | Flush all buffered values in one request (async). Clears the buffer on success. |

## `fetch`, `env`, timers

- **`fetch(url, options?)`** — http/https only, 30s timeout, 10 MiB max body. Returns `{ status, ok, headers, text(), json() }`.
- **`env`** — frozen record of strings from a `.env` file in the script's directory merged with process env. Access as `env.MY_KEY`.
- **Timers** — `setInterval`/`setTimeout` keep the sandbox alive; it exits once nothing is pending and all timers are cleared.

## Script lifecycle

1. The script runs as an IIFE — **top-level `await` is not supported**.
2. Wrap async work in a function and call it: `main()` or `void main()`.
3. The sandbox waits for pending operations and active timers.
4. Once idle (nothing pending, no timers), it exits.

```typescript
async function main() {
  await doc.publish();
  setInterval(async () => { await pub.send(); }, 1000); // keeps the sandbox alive
}

main();
```
