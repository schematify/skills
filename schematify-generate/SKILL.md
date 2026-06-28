---
name: schematify-generate
description: Generate Schematify graph scripts from a codebase, directory, dataset, or described system. Use when the user wants a Schematify graph derived from source material rather than editing an existing graph script.
---

# Schematify Generate

Use this skill to derive a Schematify graph from source material. Any graph output must be a Schematify graph script; do not use alternative graph formats.

## Source-first analysis

This skill guides how to turn analyzed source material into a Schematify graph. It does not replace normal codebase, dataset, or domain analysis.

When deriving a graph from a codebase, directory, dataset, or described system:

1. Inspect the source material first, independently of Schematify.
2. Identify the important entities, boundaries, responsibilities, and relationships.
3. Ground nodes and links in observed evidence where possible, such as files, imports, routes, configuration, schemas, service calls, data models, queues, APIs, documentation, or structured records.
4. Build a conceptual graph model before writing Schematify code.
5. Then translate that model into a Schematify graph script using `schematify-graphs`.

Schematify is the target representation and publishing workflow; source inspection and architectural reasoning still come from the agent's normal analysis of the material.

Pick the generation mode:

- **Architecture** — logical components and major relationships.
- **Code dependency** — source files and resolved internal imports.
- **File structure** — directories/files nested by containment.
- **Custom data** — user/data-defined entities, hierarchy, and links.

Read the matching reference:

- Architecture: [references/architecture.md](references/architecture.md)
- Code dependency: [references/dependency.md](references/dependency.md)
- File structure: [references/file-structure.md](references/file-structure.md)
- Custom data: [references/generic.md](references/generic.md)

After source-first analysis, produce a plan: nodes with ids, labels, types, descriptions, hierarchy, and links as source → target paths. Important nodes and links should be grounded in inspected source material or clearly identified as inferred. The graph already has an implicit root; do not add a redundant top-level root node.

Then use `schematify-graphs` to author and run the TypeScript script. Even when reading JSON sources or examples, write new graph outputs as TypeScript. Run capture first. Use `--live` only on explicit user instruction.
