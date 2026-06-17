# Channels & Live Publishing

Use this reference only when a graph script defines channels, sends live values, or runs a polling loop. Confirm current runner flags with `schematify run --help`.

## Mental model

- The graph document contains structure: nodes, links, attributes, and channel definitions.
- Channel values are live data sent later with `channelPublisher`.
- Channels are slots; the publisher fills those slots by node path.

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

## Capture vs live

`schematify run` is safe by default: do not use `--live` unless the user explicitly asks for a real publish.

In capture/default mode:

- `doc.publish()` writes/captures the graph document according to the runner's current behavior.
- `channelPublisher.send()` captures channel updates separately from the document, because live values are not part of the graph document.
- The exact output paths and flags are CLI-owned; check `schematify run --help`.

In live mode:

- The document is published to Schematify.
- Channel values are sent live.
- Publishing a graph with an existing id can overwrite that graph.

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

When validating a loop, bound the run with the max-duration/max-publishes flags supported by the installed CLI. Inspect the captured channel output before any live run.
