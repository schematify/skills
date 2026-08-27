---
name: schematify-cli
description: Operate the schematify CLI for schematify resources — graphs, schemas, diagrams, documents (list, push, pull, delete, publish, generate). Run the CLI rather than searching the filesystem.
---

# Schematify CLI

`schematify` is a self-contained compiled binary (closed source — not an npm package, never in `node_modules`). It is the source of truth for schematify resources: query it rather than grepping the filesystem or codebase. If it is not on PATH, tell the user it is not installed and ask how to proceed.

Discover commands and flags from the CLI's own help — never guess. If a flag isn't in `--help`, it doesn't exist.

```bash
schematify --help
schematify <command> --help
```

- `--json` — use whenever you need to parse output. Emits structured JSON and suppresses spinners/colors/hints; errors become `{ "error": "...", "details": "..." }` on stdout.
- Action commands (push, delete, publish) report success via exit code: 0 = ok, 1 = fail.

## Lightweight inspection/listing

### Ambiguous overview requests

For ambiguous requests such as "check my schematify diagrams", "show my graphs", or "what diagrams do I have?", do not pull resources by default.

Run `schematify list --json` and summarize the returned inventory using only list metadata: label, id/reference, and modified date if present.

Then ask what the user wants to do next, for example: validate, summarize, inspect structure, find broken links, view descriptions, or update a selected diagram.

Pull a document only when the user:

- selects a specific resource for deeper inspection,
- asks for fields not available from `list`, such as top-level `description`,
- asks for validation,
- asks for internals such as nodes, links, channels, or paths,
- asks for issues or broken references,
- asks to edit/update/publish.

When a document is pulled, use the **schematify-graphs** skill for graph/document structure semantics. In pulled documents, the diagram title is the top-level `label`, and the diagram description is the top-level `description`.

For node/path/link/channel structure, use the **schematify-graphs** skill rather than inferring semantics only from ad-hoc JSON scans.

## Authoring graphs

Graphs are written as TypeScript. Use **schematify-graphs** for graph structure, **schematify-render** for `.render(...)` styles and params, and **schematify-generate** to derive a graph from a codebase or dataset.

Validate without server writes first:

```bash
schematify dry-run <script>
```

Publish only when requested:

```bash
schematify run <script>
```

`run` writes to the server; `dry-run` does not.
