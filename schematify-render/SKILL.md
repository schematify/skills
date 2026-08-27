---
name: schematify-render
description: Configure Schematify node rendering through .render(), including property cards, reports, pie charts, bar charts, line charts, render params, bindings, and sizing. Use whenever choosing or changing a node's render.style, render.params, or render.scale.
---

# Schematify render

Use this skill with **schematify-graphs** whenever a graph script calls `.render(...)`. The render interface is style-dependent: each `style` accepts a different `params` object, and some params accept bindings while others must be raw configuration values.

## Render workflow

1. Choose the style based on the information the node must show.
2. Read the matching reference before writing `params`.
3. Put the style's required data in attributes or channels, then bind it with `from.attribute(...)` or `from.channel(...)` where supported.
4. Keep display configuration as raw values when the style reference marks it **raw only**. Do not wrap those values in `from.value(...)`.
5. Set `render.scale` when the default node size is too small for the content.
6. Validate the complete script with `schematify dry-run <script>` before publishing.

## Common render interface

```typescript
node("metric")
  .render({
    style: "property",
    params: {
      header: from.value("P99 latency"),
      "display-value": from.attribute("latency"),
    },
    scale: { x: 1.5, y: 1.2 },
    collapse: true,
  })
```

- `style` selects the renderer. It defaults to `default`.
- `params` is the style-specific interface. Never reuse params merely because another style accepts the same value type.
- `scale` has numeric `x` and `y` multipliers. Both default to `1`.
- `collapse` defaults to `true` and controls the initial state of nodes with children.
- Do not set `render.texture` directly. Select visuals with `.type(...)`; Schematify resolves the node type's texture.

A node with visible children renders as a group container instead of its configured style. Put property, report, and chart styles on leaf nodes. A collapsed group renders as a closed node, but specialized render styles should not be used to make an ordinary group double as a dashboard card.

## Bindings

A binding resolves a param from the current node:

```typescript
from.attribute("region")
from.channel("cpu")
from.value("CPU usage")
```

Raw strings, numbers, booleans, and arrays are literal param values. Complex chart data should usually live in `.attributes(...)` or a channel default and be referenced with a binding. In the reference tables, **literal** means `from.value(...)`; **raw** means placing the value directly in `params`.

Binding support is not uniform. Read the style reference. In particular, several bar and line chart display options are read directly from `params`; `from.value(...)` does not work for those options.

## Style index

- `default`: normal icon node. No params. `scale` changes the type texture's base width and height.
- `property`: one prominent scalar value with a required header. Read [references/property.md](references/property.md).
- `report`: rows selected from attributes and channels. Read [references/report.md](references/report.md).
- `pie-chart`: positive values as proportional slices. Read [references/pie-chart.md](references/pie-chart.md).
- `bar-chart`: categorical values, including negative values. Read [references/bar-chart.md](references/bar-chart.md).
- `line-chart`: one or more ordered series, including negative values. Read [references/line-chart.md](references/line-chart.md).
- `chart`: reserved but not implemented. It falls back to the default renderer. Do not author new nodes with this style.

For the accepted chart data shapes shared by pie, bar, and line charts, read [references/chart-data.md](references/chart-data.md). A complete static example is in [examples/render-styles.ts](examples/render-styles.ts).

## Style selection

Use `default` for almost all architecture nodes. Use a specialized style only when its presentation carries information:

- `property` for one named value.
- `report` for a compact record or table definition.
- `pie-chart` for parts of a positive whole.
- `bar-chart` to compare categories.
- `line-chart` for an ordered sequence or several comparable series.

Static facts belong in attributes. Values that will be published repeatedly belong in channels. Choosing a specialized renderer does not make static data live.
