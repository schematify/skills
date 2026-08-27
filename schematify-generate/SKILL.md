---
name: schematify-generate
description: Generate Schematify graph scripts from a codebase, directory, dataset, or described system. Use when the user wants a graph derived from source material rather than an edit to an existing graph script.
---

# Schematify generate

Use this skill to decide what a source-derived graph should contain. The output is always a Schematify TypeScript graph script, not Mermaid, DOT, or another graph format.

## Workflow

1. Inspect the source material before writing graph code.
2. Identify the important entities, containment, responsibilities, and relationships.
3. Ground important nodes and links in evidence such as files, imports, routes, configuration, schemas, service calls, data models, APIs, documentation, or structured records.
4. Form a brief graph model before authoring the script.
5. Use **schematify-graphs** to implement and validate that model.

Mark important inferred relationships as inferred when the source does not establish them directly.

## Choose the graph kind

- **Architecture:** Logical components and major relationships.
- **Code dependency:** Source files and resolved internal imports.
- **File structure:** Directories and files nested by containment.
- **Custom data:** Entities, hierarchy, and links from structured data or a user description.

Read only the matching reference:

- Architecture: [references/architecture.md](references/architecture.md)
- Code dependency: [references/dependency.md](references/dependency.md)
- File structure: [references/file-structure.md](references/file-structure.md)
- Custom data: [references/generic.md](references/generic.md)

## Before authoring

The graph model should identify node ids, labels, types, descriptions, hierarchy, and root-relative link targets. Keep this as working material unless showing the plan would help the user.

`graph(...).children(...)` already provides the document root. Do not add a redundant node that repeats the graph title merely to act as a root.

Use **schematify-render** only when a node needs `.render(...)`. Validate with `schematify dry-run <script>`. Publish with `schematify run <script>` only when the user asks.
