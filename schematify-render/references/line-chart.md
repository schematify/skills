# Line chart render style

Use `line-chart` for an ordered series or for several series that share category labels and a numeric axis. It supports finite positive, zero, and negative values. Read [chart-data.md](chart-data.md) for accepted single-series and multi-series shapes.

```typescript
node("latency")
  .label("Latency percentiles")
  .attributes({
    latencyData: [
      {
        label: "p50",
        data: { Mon: 18, Tue: 21, Wed: 19 },
      },
      {
        label: "p99",
        data: { Mon: 92, Tue: 118, Wed: 105 },
      },
    ],
  })
  .render({
    style: "line-chart",
    params: {
      header: "API latency",
      datasets: from.attribute("latencyData"),
      yLabel: "ms",
      domainMin: 0,
      showDots: true,
      lineWidth: 2,
      fill: false,
      sort: "none",
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
| `data` | One of `data` or `datasets` | attribute, channel, literal | Single-series dataset. |
| `datasets` | One of `data` or `datasets` | attribute, channel, literal | Array of `{ label, data }` series. A non-empty `datasets` array takes precedence over `data`. |
| `header` | No | attribute, channel, literal, direct | Title above the chart. Default is no title. |
| `yLabel` | No | attribute, channel, literal, direct | Rotated vertical-axis label. Default is no label. |
| `domainMin` | No | attribute, channel, literal, direct | Explicit numeric y-axis minimum. Auto-calculated when absent. |
| `domainMax` | No | attribute, channel, literal, direct | Explicit numeric y-axis maximum. Auto-calculated when absent. |
| `baseline` | No | attribute, channel, literal, direct | Numeric value used for the baseline and area fill. Default is `0`. |

Set `domainMin` lower than `domainMax`. Include the intended baseline and values inside fixed bounds.

## Display configuration params

These are **direct-only** configuration values. Do not wrap them in `from.value(...)`, `from.attribute(...)`, or `from.channel(...)`.

| Param | Required | Values and default |
|---|---:|---|
| `sort` | No | `"asc"`, `"desc"`, or `"none"`. Sorts points by numeric value within each series. Default is `"none"`. |
| `labelScale` | No | Text multiplier clamped to `0.5` through `3`. Default is `1`. |
| `padding` | No | Internal padding ratio from `0` to `1`. Default is `0.1`. |
| `showDots` | No | Boolean. Default is `true`. |
| `lineWidth` | No | Numeric stroke width clamped to `0.5` through `10`. Default is `2`. |
| `fill` | No | Boolean. Fills the area between each line and the baseline. Default is `false`. |

## Single series

```typescript
.render({
  style: "line-chart",
  params: {
    data: from.attribute("weeklyRequests"),
    header: "Weekly requests",
    yLabel: "req/day",
    fill: true,
    domainMin: 0,
  },
  scale: { x: 3, y: 2 },
})
```

## Behavior

- Data order defines x-axis order unless `sort` is set. `sort` orders by value, not by label or time. Leave it as `"none"` for time series.
- Multi-series charts build one shared x-axis from the first occurrence of each label across the series.
- A legend appears when there is more than one series and at least one series has a non-empty label.
- `fill` applies to every series.
- Hovering finds the nearest point and displays its series, label, value, and percentage of that series' absolute total.
- Axis labels abbreviate thousands and millions as `k` and `M`.

Charts have a 200 by 200 pixel base size. Increase `render.scale.x` for longer sequences and `render.scale.y` when the legend, header, and axis labels need more room.
