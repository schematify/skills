# Architecture

Generate a conceptual architecture graph: logical components and their major relationships, not a file listing. Architecture graphs are static design documentation unless the user explicitly asks for monitoring/live updates.

## Recon

Inspect enough of the target to identify:

- project/app type and boundaries
- entry points and major source/config/docs files
- services, modules, databases, APIs, external integrations
- containment/layers, e.g. frontend/backend, app/packages/services
- observed relationships: calls, imports, runtime dependencies, data flow

Ignore generated/vendor/build directories unless relevant.

## Plan

- **Nodes:** logical components or groups, not individual files.
- **IDs:** stable role-based ids, unique among siblings: `api`, `auth-service`, `user-db`.
- **Hierarchy:** containment becomes nested `.children([...])`.
- **Links:** major communication/dependency paths only, source → target path.
- **Types:** use project/texture-pack ids when known; otherwise sensible generic component/group/database types.
- **Rendering:** use default rendering for ordinary services/infrastructure. If the plan needs a table-like record, scalar property, or chart, load `schematify-render` before configuring it.
- **Channels/status:** omit channels and status badges for static architecture graphs.

Return the node/link plan to `schematify-generate` for graph authoring.
