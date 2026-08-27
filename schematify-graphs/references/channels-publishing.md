# Channels and live publishing

Use channels when values must change after the graph document is published. Monitoring, telemetry, status updates, and polling are common examples. Static architecture, design, and schema diagrams should normally use attributes instead.

## Terms

- A **channel** is a named live value slot defined on a node.
- A **channel default** is the initial or fallback value included in the graph document.
- A **channel publisher** sends replacement values to channels on an already published graph.
- A **live graph** contains channel values that can change without rebuilding its node and link structure.
- A **real-time update** is a channel value sent while the publishing script is running. The update frequency comes from the script or its data source.

## Define channels

```typescript
node("server")
  .channels([
    channel("status").label("Status").default("base/healthy"),
    channel("cpu").label("CPU").default("N/A").staleAfter(5000),
  ])
  .status({ type: from.channel("status") });
```

Set `staleAfter` on the graph for a shared threshold or on one channel for a specific threshold.

## Send values

```typescript
await doc.publish();

const pub = channelPublisher(doc.id);
pub.set("server", { status: "base/healthy", cpu: "45%" });
pub.set("server/disk", { usage: "82%" });
await pub.send();
```

`set()` updates a local buffer. `send()` transmits the buffered changes. Publisher paths are root-relative node paths.

## Dry-run and publish

Validate without server writes:

```bash
schematify dry-run graph.ts
```

Publish the graph and send channel values only when requested:

```bash
schematify run graph.ts
```

Publishing a graph with an existing id can overwrite the server document.

## Polling loops

An active interval keeps the script running:

```typescript
async function main() {
  await doc.publish();
  const pub = channelPublisher(doc.id);

  async function tick() {
    const response = await fetch("https://metrics.example/stats");
    const stats = await response.json();
    pub.set("server", { cpu: `${stats.cpu}%` });
    await pub.send();
  }

  setInterval(tick, 5000);
  await tick();
}

main();
```

Use the installed CLI help to find its duration option. Bound loops during validation and one-off publishing so they cannot run indefinitely.
