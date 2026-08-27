# Custom data

Generate a graph from structured data or a user-described system. Sources may include CSV, JSON, API output, org charts, process flows, and domain models.

## What to establish

Identify or ask for:

- the repeated entity that becomes a node,
- containment or grouping,
- directional relationships,
- stable ids unique among siblings,
- labels, node types, and useful metadata,
- values that must update after publication.

Read or fetch structured input before mapping its records. For a verbal description, use the named entities and relationships. Ask only for information required to build a coherent graph.

## Graph model

- **Nodes:** Create one per entity and group them when grouping adds meaning.
- **Hierarchy:** Represent containment with nested `.children([...])`.
- **Links:** Connect source nodes to root-relative target paths.
- **Attributes:** Store static metadata.
- **Channels:** Use channels only for values expected to change after publication.
- **Types:** Use a known node type when it fits, otherwise use a generic type.
