# Custom Data

Generate a graph from user-described entities or structured data such as CSV, JSON, API output, org charts, process flows, or domain models.

## Recon

Identify or ask for:

- **Node unit:** the repeated entity instance.
- **Hierarchy:** containment/grouping, if any.
- **Links:** directed relationships between nodes.
- **IDs:** stable unique keys, at least among siblings.
- **Labels/types/attributes:** display fields and metadata.
- **Channels:** only values expected to update live; omit for static domain/data diagrams.

For structured data, read/fetch the source and map records to nodes and links. For verbal descriptions, use the given entities/relationships or ask for the missing list.

## Plan

- **Nodes:** one per entity instance, grouped if useful.
- **Hierarchy:** nested `.children([...])`.
- **Links:** source → target paths.
- **Attributes:** static metadata.
- **Channels:** live/updating values only; do not add status/metric channels to static diagrams.
- **Types:** use fitting texture-pack ids when known; otherwise generic types.

Return the node/link/channel plan to `schematify-generate` for graph authoring.
