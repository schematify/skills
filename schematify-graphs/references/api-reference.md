# Schematify builder API reference

This is a compact reference for graph scripts. The installed CLI help remains authoritative for runner commands and flags.

## Sandbox globals

Scripts run in a V8 isolate rather than Node.js. They cannot use imports, Node built-ins, or the filesystem.

| Global | Purpose |
|---|---|
| `graph(id)` | Create a graph document. The id must be a UUID. |
| `node(id)` | Create a node. Sibling ids must be unique. |
| `channel(id)` | Define a live value slot on a node. |
| `from` | Bind status and render parameters to values. |
| `channelPublisher(graphId)` | Buffer and send channel updates for a graph. |
| `env` | Read-only environment variables. |
| `fetch(url, options?)` | Make an HTTP or HTTPS request. |
| `console` | Write diagnostic output. |
| timers | `setTimeout`, `setInterval`, `clearTimeout`, and `clearInterval`. |

Use an async `main()` function and call it. Do not rely on top-level `await`.

## `graph(id)`

Replace the example UUID when creating a new graph.

```typescript
const doc = graph("550e8400-e29b-41d4-a716-446655440000")
  .label("My platform")
  .children([
    node("api").label("API").links(["data/db"]),
    node("data").label("Data").children([
      node("db").label("Database"),
    ]),
  ]);

await doc.publish();
```

| Method or property | Purpose |
|---|---|
| `.label(name)` | Set the graph display name. |
| `.description(text)` | Set the graph description. |
| `.staleAfter(ms)` | Set the default channel staleness threshold. |
| `.nodeTypes(packs)` | Register custom node type packs. |
| `.children(nodes)` | Set top-level nodes. |
| `.compile()` | Return the compiled document without publishing it. |
| `.publish()` | Compile the document and pass it to the runner. Dry-run prints it; run publishes it. |
| `.id` | Return the graph UUID, suitable for `channelPublisher`. |

## `node(id)`

A node path joins its id to its ancestor ids. For example, node `routes` inside node `api` has the root-relative path `api/routes`.

| Method | Purpose |
|---|---|
| `.label(name)` | Set the node display name. |
| `.type(typeId)` | Select the node's visual type. It does not change graph behavior. |
| `.attributes(obj)` | Store static key-value metadata. The `description` key becomes the node description. |
| `.channels(channels)` | Define live value slots on this node. |
| `.status(config)` | Bind a status badge, usually with `from.channel(...)`. |
| `.render(config)` | Configure a specialized renderer. Load **schematify-render** first. |
| `.links(paths)` | Link to root-relative node paths. Nested targets include every ancestor id. |
| `.children(nodes)` | Add nested nodes. |

A node type id such as `microservices/service` selects a visual texture from a node type pack. Prefer documented ids over invented values.

## `channel(id)`

```typescript
channel("cpu").label("CPU").default("N/A").staleAfter(5000)
```

| Method | Purpose |
|---|---|
| `.label(name)` | Set the display name. It defaults to the channel id. |
| `.default(value)` | Set the initial or fallback value. |
| `.staleAfter(ms)` | Set this channel's staleness threshold. |

## `from`

Bindings read values for `.status(...)` and `.render(...)`:

```typescript
from.channel("status")
from.attribute("region")
from.value("Static text")
```

## `channelPublisher(graphId)`

```typescript
const pub = channelPublisher(doc.id);
pub.set("api", { status: "base/healthy", cpu: "45%" });
await pub.send();
```

| Method | Purpose |
|---|---|
| `.set(nodePath, channels)` | Buffer channel values for a root-relative node path. Repeated calls merge keys. |
| `.send()` | Send buffered values and clear the buffer after success. |

## Other globals

- `fetch(url, options?)` supports HTTP and HTTPS and returns `status`, `ok`, `headers`, `text()`, and `json()`.
- `env` is a read-only string map populated from the script directory's `.env` file and process environment.
- Active timers keep the sandbox running until they are cleared.

Read [channels-publishing.md](channels-publishing.md) for live update workflows. Use **schematify-render** for renderer parameters and sizing.
