# Property render style

Use `property` for one named scalar value. Both `header` and `display-value` are required for a useful property node.

```typescript
node("latency")
  .label("API latency")
  .type("microservices/service")
  .attributes({ latency_p99: "42 ms" })
  .render({
    style: "property",
    params: {
      header: from.value("P99 latency"),
      "display-value": from.attribute("latency_p99"),
    },
    scale: { x: 1.5, y: 1.2 },
  })
```

## Params

| Param | Required | Binding support | Value |
|---|---:|---|---|
| `header` | Yes | attribute, channel, literal, raw | Text displayed above the value. |
| `display-value` | Yes | attribute, channel, literal, raw | The prominent scalar value. |

The renderer resolves both params through the standard binding helpers.

## Display behavior

- The header is uppercased and displayed with a trailing colon.
- If the header resolves but the value is null, undefined, empty, or whitespace, the renderer displays a dash placeholder.
- If the header is missing or empty, the node displays `Value not set` and does not display the supplied value. Treat `header` as required.
- The node's `.label(...)` remains the external canvas label. It is separate from the property header.

Property nodes use the node type texture's base dimensions. `render.scale` multiplies that width and height.

## Live value example

```typescript
node("queue-depth")
  .label("Orders queue")
  .type("microservices/message-queue")
  .channels([
    channel("depth").label("Queue depth").default(0),
  ])
  .render({
    style: "property",
    params: {
      header: from.value("Pending messages"),
      "display-value": from.channel("depth"),
    },
    scale: { x: 1.5, y: 1.2 },
  })
```

Use `channelPublisher` to update `depth`; do not rebuild the document for each value.
