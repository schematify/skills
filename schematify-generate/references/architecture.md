# Architecture

Generate a conceptual architecture graph: logical components and their major relationships, not a file listing.

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

Return the node/link plan to `schematify-generate` for graph authoring.
