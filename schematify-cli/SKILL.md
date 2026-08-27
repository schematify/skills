---
name: schematify-cli
description: Operate the Schematify CLI for published resources and command discovery. Use local TypeScript graph scripts when creating or editing source-authored graphs.
---

# Schematify CLI

`schematify` is a compiled binary, not an npm package or a dependency in `node_modules`. If it is not on `PATH`, tell the user it is unavailable and stop rather than guessing another interface.

Discover commands and flags from the installed CLI help:

```bash
schematify --help
schematify <command> --help
```

If a flag is absent from `--help`, do not invent it.

- Use `--json` when output needs parsing. It suppresses presentation output and returns structured errors on stdout.
- Action commands such as push, delete, and publish report success through their exit code. Zero means success.

## Local source and published state

A graph can have two editable representations:

- A local TypeScript graph script used to generate and publish the graph.
- A JSON graph document stored on the Schematify server, which can also be edited independently.

For source-authored work, use the TypeScript script as the authoring source and follow `script -> dry-run -> run`. Do not pull another published graph to infer how to edit an existing local script.

The server is authoritative for its current published state. Publishing a script with an existing graph id can overwrite server-side edits. When the task involves reconciling remote changes, pull that specific graph and compare it with the local source before publishing. Do not perform this reconciliation merely to find examples.

## Inspect published resources

For an overview such as "show my diagrams", run:

```bash
schematify list --json
```

Summarize the inventory using its label, id or reference, and modified date when present. Do not pull every resource by default.

Pull a specific document when the user:

- selects it for deeper inspection,
- asks for fields absent from the list output,
- asks to inspect nodes, links, channels, descriptions, or graph paths,
- asks to validate or diagnose the published document,
- asks to edit a published graph that has no local source script,
- asks to compare published state with local source.

Use **schematify-graphs** when interpreting a pulled graph document. Its top-level `label` is the diagram title, its top-level `description` describes the diagram, and its node tree is under `root`.

## Author graph scripts

Use **schematify-graphs** for graph structure, **schematify-render** for `.render(...)`, and **schematify-generate** when deriving a graph from source material.

Validate without server writes:

```bash
schematify dry-run <script>
```

Publish only when requested:

```bash
schematify run <script>
```

`run` writes to the server. `dry-run` does not.
