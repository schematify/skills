# Report render style

Use `report` for a compact record: table columns, configuration values, or a small set of related facts. It displays one key/value row for each requested id.

```typescript
node("definition")
  .label("Table definition")
  .type("databases/table")
  .attributes({
    account_key: "TEXT PRIMARY KEY",
    user_id: "TEXT NOT NULL",
    created_at: "TIMESTAMPTZ NOT NULL",
  })
  .render({
    style: "report",
    params: {
      attributeIds: ["account_key", "user_id", "created_at"],
    },
  })
```

## Params

| Param | Required | Binding support | Value |
|---|---:|---|---|
| `attributeIds` | Yes | Raw only | Non-empty array of attribute or channel ids, in display order. |

Pass `attributeIds` directly as a string array. Do not use `from.value(...)`, `from.attribute(...)`, or `from.channel(...)` for the array itself.

For each id, the renderer checks the node's channel value first and then its attributes. A channel and attribute with the same id therefore display the channel value. Missing values display `N/A`.

The row key is the id itself. Attribute and channel labels do not rename report rows.

## Mixed static and live rows

```typescript
node("database-report")
  .label("Primary database")
  .type("databases/postgres")
  .attributes({
    engine: "PostgreSQL",
    version: "16.2",
  })
  .channels([
    channel("connections").label("Connections").default(0),
    channel("replication_lag").label("Replication lag").default("0 ms"),
  ])
  .render({
    style: "report",
    params: {
      attributeIds: ["engine", "version", "connections", "replication_lag"],
    },
  })
```

## Sizing

Report nodes calculate their width and height from `attributeIds`, the attribute values, and channel defaults available when the document loads. `render.scale` does not control report size.

Choose concise row ids and provide representative channel defaults. Very long live values can outgrow dimensions calculated from short defaults.
