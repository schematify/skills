# Architecture

Generate a conceptual architecture graph of logical components and their major relationships. Do not turn it into a file listing. Treat it as static design documentation unless the user asks for live monitoring.

## What to inspect

Inspect enough source to identify:

- the application type and system boundaries,
- entry points and major source, configuration, and documentation files,
- services, modules, databases, APIs, and external integrations,
- containment such as frontend, backend, packages, and services,
- calls, imports, runtime dependencies, and data flow.

Ignore generated, vendor, and build directories unless they affect the architecture.

## Graph model

- **Nodes:** Logical components or groups, not individual files.
- **IDs:** Stable role-based ids unique among siblings, such as `api`, `auth-service`, and `user-db`.
- **Hierarchy:** Represent containment with nested `.children([...])`.
- **Links:** Include major communication and dependency paths only. Link from the caller or producer to the dependency or consumer using a root-relative graph path.
- **Types:** Use a known node type when it fits. Otherwise use a generic component, group, or database type.
- **Rendering:** Use default rendering for ordinary components. Load **schematify-render** for a scalar property, compact report, or chart.
- **Live data:** Omit channels and status badges unless the user asks for monitoring or updates after publication.
