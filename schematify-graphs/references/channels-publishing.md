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

For requested historical recording, read [timeline.md](timeline.md). Timeline is an
explicit opt-in on the publisher; ordinary channel publishing does not retain history.
Events and conditions are registered on channel builders and evaluated on sent values.

For polling, await each send before scheduling the next iteration. `setInterval(async () => ...)` does not wait for its callback and can cause overlapping sends, which the
publisher rejects. `set()` keeps only the latest pending value per node/channel;
`send()` flushes a batch without creating a background queue.

The delay is a pause **after** each iteration, so slow reads or sends reduce the sample
rate. Timeline rules see sent observations; transitions between samples can be missed.
CLI API requests and token refreshes each have a 30-second timeout, including response
body reads. The single authentication retry can extend the total send time beyond
30 seconds. Failed batches remain available for a later `send()`, with newer values
replacing older pending values for the same channel.

These minimal examples stop on a rejected operation. If a script retries temporary
failures, catch them inside the loop and retain the delay; stop on configuration or
authentication failures. Do not silently swallow every error or retry in a tight loop.

Use one awaited loop so a slow send delays the next iteration:

```typescript
async function main() {
  await doc.publish();
  const pub = channelPublisher(doc.id);

  while (true) {
    const response = await fetch("https://metrics.example/stats");
    const stats = await response.json();
    pub.set("server", { cpu: `${stats.cpu}%` });
    await pub.send();
    await new Promise<void>(resolve => setTimeout(resolve, 5000));
  }
}

main();
```

Use the installed CLI help to find its duration option. Bound loops during validation and one-off publishing so they cannot run indefinitely. Allow enough time for startup, fetches, and the first `doc.publish()`; an earlier timeout can exit successfully without producing a document.
