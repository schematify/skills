---
name: schematify-render
description: Configure Schematify node rendering through .render(), including property cards, reports, pie charts, bar charts, line charts, bindings, and sizing.
---

# Schematify render

Use this skill with **schematify-graphs** whenever a graph script calls `.render(...)`. Each render style has its own parameters and sizing behavior. Read only the reference for the style being used.

## Workflow

1. Choose the style based on the information the node must display.
2. Read that style's reference before writing `params`.
3. Put static data in attributes and values that change after publication in channels.
4. Bind data parameters only through methods the style supports.
5. Pass display configuration directly when the reference marks it direct-only.
6. Follow the style's sizing rules. Property nodes always need an explicit width-biased scale, while reports self-size.
7. Validate the complete script with `schematify dry-run <script>` before publishing.

## Shared render fields

- `style` selects the renderer. It defaults to `default`.
- `params` belongs to the selected style. Do not copy parameters between styles without checking their references.
- `scale` multiplies the renderer's base width and height. Reports are the exception because they calculate their own dimensions.
- `collapse` controls the initial state of nodes with children. Specialized renderers should normally be leaf nodes, so it rarely applies to them.
- `.type(...)` selects the node's visual texture. Do not set `render.texture` directly.

A node with visible children renders as a group container instead of its configured specialized style. Put property, report, and chart renderers on leaf nodes.

## Bindings and direct values

A binding resolves a render parameter from the current node:

```typescript
from.attribute("region")
from.channel("cpu")
from.value("CPU usage")
```

Use these terms consistently:

- **Attribute binding:** `from.attribute(...)` reads static node metadata.
- **Channel binding:** `from.channel(...)` reads a live value that can change after publication.
- **Literal binding:** `from.value(...)` supplies a fixed value through the binding interface.
- **Direct value:** A string, number, boolean, or array placed directly in `params`.

Binding support differs by style and parameter. A parameter marked **direct-only** cannot use `from.value(...)`, `from.attribute(...)`, or `from.channel(...)`. Complex chart datasets should normally live in an attribute or channel and use a binding.

## Render styles

- `default` renders the node type's normal icon. It takes no style parameters.
- `property` displays one named scalar value. It requires a header and an explicit width-biased scale. Read [references/property.md](references/property.md).
- `report` displays selected attributes or channels as rows. It calculates its own dimensions and ignores `render.scale`. Read [references/report.md](references/report.md).
- `pie-chart` displays positive parts of a whole. Read [references/pie-chart.md](references/pie-chart.md).
- `bar-chart` compares categorical values, including zero and negative values. Read [references/bar-chart.md](references/bar-chart.md).
- `line-chart` displays one or more ordered series. Read [references/line-chart.md](references/line-chart.md).
- `chart` is reserved but not implemented. Do not use it in new scripts.

Read [references/chart-data.md](references/chart-data.md) for chart dataset shapes. A complete static example is in [examples/render-styles.ts](examples/render-styles.ts).

Use default rendering for most architecture nodes. Choose a specialized renderer only when the scalar value, record, or chart adds useful information.

## Property card shape and legibility

Property nodes display text and must read as cards rather than circular icon nodes. Their base dimensions come from `.type(...)`, so valid configuration alone does not guarantee readable proportions.

- Always set `render.scale` explicitly.
- Make the width clearly greater than the height.
- Start with `{ x: 2.5, y: 1.35 }`.
- Increase `x` when the uppercased header needs more space.
- Do not treat a successful dry run as proof that the property is readable.

When the user identifies the faulty field or supplies dimensions, apply that correction directly to the source script before researching alternatives. Do not inspect unrelated published graphs for sizing examples.

## Static and live values

Static facts belong in attributes. Values that change after publication belong in channels. Selecting a specialized renderer does not make static data live.
