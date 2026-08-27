# Bar chart render style

Use `bar-chart` to compare categorical values. It supports finite positive, zero, and negative values. Read [chart-data.md](chart-data.md) for accepted data shapes.

```typescript
node("responses")
  .label("HTTP response codes")
  .attributes({
    responseData: {
      "200": 1250,
      "301": 180,
      "400": 95,
      "404": 62,
      "500": 28,
    },
  })
  .render({
    style: "bar-chart",
    params: {
      header: "Response codes",
      data: from.attribute("responseData"),
      yLabel: "Requests",
      barLabels: "value",
      sort: "desc",
      maxBars: 5,
      domainMin: 0,
      labelScale: 1,
      padding: 0.1,
    },
    scale: { x: 3.5, y: 2.5 },
  })
```

## Data and axis params

These params pass through standard binding resolution.

| Param | Required | Binding support | Value and default |
|---|---:|---|---|
| `data` | Yes | attribute, channel, literal | Chart dataset. |
| `header` | No | attribute, channel, literal, raw | Title above the chart. Default is no title. |
| `yLabel` | No | attribute, channel, literal, raw | Rotated vertical-axis label. Default is no label. |
| `domainMin` | No | attribute, channel, literal, raw | Explicit numeric y-axis minimum. Auto-calculated when absent. |
| `domainMax` | No | attribute, channel, literal, raw | Explicit numeric y-axis maximum. Auto-calculated when absent. |
| `baseline` | No | attribute, channel, literal, raw | Numeric value from which bars extend. Default is `0`. |

Set `domainMin` lower than `domainMax`. Include the intended baseline and data range inside the domain when fixing the bounds.

## Display configuration params

These are **raw-only** configuration values. Do not wrap them in `from.value(...)`, `from.attribute(...)`, or `from.channel(...)`.

| Param | Required | Values and default |
|---|---:|---|
| `barLabels` | No | `"percent"`, `"value"`, `"both"`, or `"none"`. Default is `"none"`. |
| `sort` | No | `"asc"`, `"desc"`, or `"none"`. Sorts by numeric value. Default is `"none"`. |
| `maxBars` | No | Positive number. Truncates the array after sorting. |
| `labelScale` | No | Text multiplier clamped to `0.5` through `3`. Default is `1`. |
| `padding` | No | Internal padding ratio from `0` to `1`. Default is `0.1`. |

`showPercent` is a legacy fallback for `barLabels`; `true` maps to percentage labels. Use `barLabels` in new scripts.

## Behavior

- Negative values extend below the baseline.
- `sort` changes category order. With `sort: "desc"` and `maxBars: 5`, the renderer keeps the five largest values.
- Percentage labels and tooltips use each bar's absolute value divided by the sum of all absolute values.
- Axis labels abbreviate thousands and millions as `k` and `M`.
- Hovering a bar displays its label, value, and percentage.

Charts have a 200 by 200 pixel base size. Increase `render.scale.x` for many categories or long labels. Increase `render.scale.y` when labels, a header, and a y-axis label need more room.
