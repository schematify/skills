# Schematify Builder API Reference

Condensed snapshot of the script builder API. The CLI owns runtime behavior; confirm command flags with `schematify run --help`.

## Sandbox globals

Scripts run in a V8 isolate, not Node. There is no `import`, `require`, Node builtins, or filesystem.

| Global | Purpose |
|--------|---------|
| `graph(id)` | Create a graph document builder. `id` must be a UUID. |
| `node(id)` | Create a node builder. Sibling ids must be unique. |
| `channel(id)` | Define a live-value slot on a node. |
| `from` | Binding helpers for status/render values. |
| `channelPublisher(schemaId)` | Buffer and send live channel values. |
| `env` | Frozen environment variable record. |
| `fetch(url, options?)` | HTTP/HTTPS fetch. |
| `console` | Logging. Some output may require debug flags to surface. |
| timers | `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`. |

Async scripts should use a `main()` function; do not rely on top-level `await`.

## `graph(id)`

```typescript
const doc = graph("550e8400-e29b-41d4-a716-446655440000")
  .label("My Platform")
  .children([
    node("api").label("API").links(["db"]),
    node("db").label("Database"),
  ]);

await doc.publish();
```

| Method/property | Purpose |
|-----------------|---------|
| `.label(name)` | Display name. |
| `.description(text)` | Human-readable description. |
| `.staleAfter(ms)` | Default staleness threshold for channels. |
| `.nodeTypes(packs)` | Custom node type textures. |
| `.children(nodes)` | Top-level nodes. |
| `.compile()` | Return the document object without publishing. |
| `.publish()` | Validate, compile, and hand the document to the runner. `dry-run` prints without writes; `run` publishes to the server. |
| `.id` | Graph UUID; pass to `channelPublisher`. |

## `node(id)`

A node path is its id joined to ancestors with `/`, e.g. `api/routes`.

| Method | Purpose |
|--------|---------|
| `.label(name)` | Display name. |
| `.type(typeId)` | Node type / texture identifier. |
| `.attributes(obj)` | Arbitrary key-value metadata for the node. Some attribute keys carry document semantics; `description` is the node description field and appears in pulled documents as `attributes.description`. |
| `.channels(channels)` | Channel definitions for this node. |
| `.status(config)` | Status binding, usually `{ type: from.channel(...) }`. |
| `.render(config)` | Render style and parameter bindings. |
| `.links(paths)` | Target node paths. Sibling ids or full paths. |
| `.children(nodes)` | Nested child nodes. |

Node type ids and status values are Schematify texture-pack identifiers. Prefer ids from known examples or current Schematify docs over invented values.

## `channel(id)`

```typescript
channel("cpu").label("CPU").default("—").staleAfter(5000)
```

| Method | Purpose |
|--------|---------|
| `.label(name)` | Display name; defaults to the channel id. |
| `.default(value)` | Initial/fallback value. |
| `.staleAfter(ms)` | Per-channel staleness threshold. |

## `from`

Use bindings inside `.status()` and `.render()`:

```typescript
from.channel("status")
from.attribute("region")
from.value("static text")
```

## `channelPublisher(schemaId)`

```typescript
const pub = channelPublisher(doc.id);
pub.set("api", { status: "base/healthy", cpu: "45%" });
await pub.send();
```

| Method | Purpose |
|--------|---------|
| `.set(nodePath, channels)` | Buffer channel values for a node path. Repeated calls to the same path merge keys. |
| `.send()` | Flush buffered values in one async request; clears the buffer on success. |

For dry-run/publish behavior and loops, read [channels-publishing.md](channels-publishing.md) only when needed.

## Other globals

- `fetch(url, options?)`: HTTP/HTTPS only. Returns an object with `status`, `ok`, `headers`, `text()`, and `json()`.
- `env`: frozen string map from `.env` in the script directory plus process environment.
- Timers keep the sandbox alive until cleared.
