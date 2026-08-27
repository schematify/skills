# Pie chart render style

Use `pie-chart` to show positive parts of a whole. Read [chart-data.md](chart-data.md) for accepted data shapes.

```typescript
node("traffic")
  .label("Traffic breakdown")
  .attributes({
    methods: {
      GET: 450,
      POST: 230,
      PUT: 85,
      DELETE: 35,
    },
  })
  .render({
    style: "pie-chart",
    params: {
      header: from.value("HTTP methods"),
      data: from.attribute("methods"),
      legend: "right",
      padding: 0.1,
    },
    scale: { x: 2.5, y: 2 },
  })
```

## Params

| Param | Required | Binding support | Values and default |
|---|---:|---|---|
| `data` | Yes | attribute, channel, literal | Chart dataset. Only finite values greater than zero become slices. |
| `header` | No | attribute, channel, literal, raw | Title above the chart. Default is no title. |
| `legend` | No | attribute, channel, literal, raw | `"right"`, `"bottom"`, or `false`. Default is `"right"`. Strings `"false"` and `"none"` also hide it. |
| `padding` | No | attribute, channel, literal, raw | Internal padding ratio from `0` to `1`. Default is `0.1`. |

All pie chart params pass through standard binding resolution. Raw values and `from.value(...)` both work.

## Rendering behavior

- Slice colors are generated from the node type's background color.
- Hovering a slice displays its label, value, and percentage of the total.
- Empty or invalid data displays the chart's empty state.
- The legend truncates entries when the available chart height cannot fit every row.
- Any unsupported `legend` value falls back to `"right"`.

Charts have a 200 by 200 pixel base size. `scale: { x: 2.5, y: 2 }` requests a 500 by 400 chart area. Allow enough width for a right-hand legend or enough height for a bottom legend.
