# Edge labels

An edge label tells the reader what a relationship means. Aim to make `source → label → target` read as a useful statement. Node names already identify the endpoints; the label should add the operation, payload, or business purpose.

## Choose the text

Prefer a compact verb and object, usually two to five words. Keep labels near 24 characters where practical, but preserve meaning and exact event or operation names over an arbitrary length limit.

| Too vague on its own | More useful when established by the source |
|---|---|
| `calls` | `reserves inventory` |
| `calls` | `validates access token` |
| `reads` | `reads order history` |
| `writes` | `stores payment result` |
| `publishes` | `publishes OrderPlaced` |
| `consumes` | `consumes OrderPlaced` |
| `uses` | `loads pricing rules` |

These are examples, not defaults for a service, database, or queue type. Inspect the call site, query, event name, configuration, or user description before choosing a phrase. Do not turn an import or a generic connection into an invented business operation. A generic verb is acceptable when that is all the evidence establishes; omit repetitive labels when they add no information.

Preserve useful authored labels when editing. Avoid protocol-only labels such as `HTTP` unless the protocol is what the diagram needs to explain. Put detailed implementation context in node descriptions or attributes rather than paragraphs on edges.

## Direction

Describe the relationship in the source-to-target direction already represented by the link. A caller-to-dependency graph and a payload-flow graph can have different directions; do not reverse links just to suit a label.

- Order service → Inventory service: `reserves inventory`.
- Order service → Event bus: `publishes OrderPlaced`.
- Event bus → Analytics worker in a payload-flow graph: `delivers OrderPlaced`.
- Analytics worker → Event bus in a dependency graph: `consumes OrderPlaced`.

Choose the convention that matches the graph's purpose and use it consistently. Label an important inferred relationship as inferred in its text or nearby description; do not present guessed details as source facts.

## Script and document shape

```typescript
node("orders").links([
  { to: "inventory", label: "reserves inventory" },
  { to: "events/bus", label: "publishes OrderPlaced" },
  "shared/config",
]);
```

The builder supplies the source path, link id, and forward direction. The resulting document stores labels directly on links under `root.links`:

```json
{
  "id": "orders-to-inventory",
  "from": "orders",
  "to": "inventory",
  "direction": "forwards",
  "link-type": "default",
  "label": "reserves inventory"
}
```

The JSON id above is illustrative; the builder generates its own id. Do not put text into `link-type`, `attributes.label`, or a fabricated edge-label node.

Object targets require a CLI build with labelled-link support; older runners accept only string targets. Validate with `schematify dry-run`. If the installed runner rejects object targets, report the compatibility mismatch rather than dropping labels silently or inventing a builder method.

## Display behaviour

In a client with edge-label support, the viewer chooses **Off**, **On**, or **Selected** in Settings:

- **Off:** Labels remain in the document but are not displayed.
- **On:** Inline centre labels participate in ELK layout. The client displays at most 24 characters, including an ellipsis when shortened.
- **Selected:** Full authored text appears in floating tooltips for connections of selected nodes. Selection does not rerun the graph layout; tooltips avoid one another by stacking vertically.

Store the complete concise phrase in `label`; do not pre-truncate it or append your own ellipsis. Display mode and tooltip placement are viewer concerns, not graph-script settings. Labelled graphs still need readable structure and sensible grouping; adding labels is not a substitute for a clear graph model.
