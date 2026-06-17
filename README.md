# Agent Skills

A collection of agent skills for [Schematify](https://schematify.com) — the relational data graph rendering tool.

## Install all skills

```bash
npx skills@latest add schematify/skills --skill '*'
```

This installs all Schematify skills while still prompting you to choose the agent harness and whether to install globally or for the current project.

## Skills

- **schematify-cli** — Operate the Schematify CLI tool. Use whenever working with graphs, schemas, documents, or any Schematify resource.

- **schematify-graphs** — Author Schematify graphs as scriptable TypeScript using the `graph`/`node`/`channel` builder API, run them safely, and publish live channel data.

- **schematify-generate** — Turn a codebase, directory, or dataset into a graph: work out what to map and how to source it, then author it with schematify-graphs.

The three compose: **schematify-cli** operates the tool, **schematify-graphs** authors graphs in code, and **schematify-generate** sources nodes and links from a project or dataset and hands them to schematify-graphs.

