---
name: schematify-generate
description: Generate Schematify graph scripts from a codebase, directory, dataset, or described system. Use when the user wants a Schematify graph derived from source material rather than editing an existing graph script.
---

# Schematify Generate

Use this skill to derive a Schematify graph from source material. Any graph output must be a Schematify graph script; do not use alternative graph formats.

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

Produce a plan: nodes with ids, labels, types, hierarchy, and links as source → target paths. The graph already has an implicit root; do not add a redundant top-level root node.

Then use `schematify-graphs` to author and run the TypeScript script. Even when reading JSON sources or examples, write new graph outputs as TypeScript. Run capture first. Use `--live` only on explicit user instruction.
