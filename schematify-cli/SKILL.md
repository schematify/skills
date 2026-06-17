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

## Authoring graphs

Graphs are written as TypeScript and run with `schematify run <script>` — capture-by-default, so nothing reaches the server without `--live`. Use the **schematify-graphs** skill to author and run scripts, and **schematify-generate** to derive a graph from a codebase or dataset.
