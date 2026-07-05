# Channels & Live Publishing

Use this reference only when the user asks for live values, monitoring, telemetry, status updates, or polling loops. Static architecture/design/schema diagrams should not define channels or publishers.

Confirm current runner flags with `schematify dry-run --help` and `schematify run --help`.

## Mental model

- The graph document contains structure: nodes, links, attributes, and optional channel definitions.
- Channels are live-data slots on nodes.
- `channelPublisher` sends values into those slots by absolute node path.
- Channels/status are for runtime/live graphs, not ordinary documentation diagrams.

## Define channels

```typescript
node("server")
  .channels([
    channel("status").label("Status").default("base/healthy"),
    channel("cpu").label("CPU").default("—").staleAfter(5000),
  ])
  .status({ type: from.channel("status") });
```

`staleAfter` can be set on the graph or individual channels.

## Send values

```typescript
await doc.publish();

const pub = channelPublisher(doc.id);
pub.set("server", { status: "base/healthy", cpu: "45%" });
pub.set("server/disk", { usage: "82%" });
await pub.send();
```

`set()` only updates a local buffer. `send()` flushes the buffered patches. Node paths use `/` for nested nodes.

## Dry-run vs publish

Validate without server writes:

```bash
schematify dry-run graph.ts
```

Publish/send live values only when requested:

```bash
schematify run graph.ts
```

`run` writes to the server. Publishing a graph with an existing id can overwrite that graph.

## Loops

A script with an active interval keeps running:

```typescript
async function main() {
  await doc.publish();
  const pub = channelPublisher(doc.id);

  async function tick() {
    const res = await fetch("https://metrics.example/stats");
    const stats = await res.json();
    pub.set("server", { cpu: `${stats.cpu}%` });
    await pub.send();
  }

  setInterval(tick, 5000);
  await tick();
}

main();
```

When validating or publishing a loop, bound it with the duration controls supported by the installed CLI, e.g. `--max-duration` when available.
