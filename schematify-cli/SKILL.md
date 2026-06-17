---
name: schematify-cli
description: Operate the schematify CLI tool. Use whenever the user mentions schematify, graphs, schemas, diagrams, documents, listing graphs, pushing, pulling, deleting, patching, generating, or any schematify-related task. Always run the CLI binary rather than searching the filesystem.
---

# Schematify CLI

**Always use the `schematify` CLI to answer questions about schematify resources (graphs, schemas, documents, diagrams).** Never search the filesystem or codebase for schematify data — the CLI is the source of truth.

## Finding the binary

Before using the CLI, confirm `schematify` is accessible by trying to run it (e.g. `schematify --version`). If that fails, check common locations like `~/.local/bin/schematify` or `./node_modules/.bin/schematify`.

If the binary cannot be found anywhere, tell the user the CLI is not installed or not on their PATH and ask how they'd like to proceed.

## Discovering commands and options

**Never invent or guess flags, options, or arguments.** Only use what the CLI's built-in help reports. If a flag isn't in the help output, it doesn't exist.

```bash
schematify --help
schematify <command> --help
schematify <command> <subcommand> --help
```

Run the relevant help command first, read the output, then construct the invocation using only the documented flags.

## Machine-readable output

**YOU MUST** Use `--json` on any command where you need to parse the output. This emits structured JSON on stdout and suppresses all human UX (spinners, colors, hints). Errors in JSON mode produce `{ "error": "...", "details": "..." }` on stdout.

For commands that perform actions (push, delete, publish), rely on the exit code: 0 = success, 1 = failure.

## Building graphs

Graphs are authored as **TypeScript** and executed with `schematify run <script>` (the script builds a graph and can publish live channel data). For writing or running those scripts, use the **schematify-graphs** skill; to derive a graph from a codebase or dataset, use **schematify-generate**.

`schematify run` is capture-by-default — it does not write to the server unless you pass `--live`. Confirm flag behavior with `schematify run --help` before running.