# Agent Skills

A collection of agent skills for [Schematify](https://schematify.com) — the relational data graph rendering tool.

## Install all skills

```bash
npx skills@latest add schematify/skills --skill '*'
```

This installs all Schematify skills while still prompting you to choose the agent harness and whether to install globally or for the current project.

## Skills

- **schematify-cli** — Operate the Schematify CLI tool. Use whenever working with graphs, schemas, documents, or any Schematify resource.

- **schematify-generate** — Generate a Schematify graph document from a project, codebase, or user-defined description. Handles intent disambiguation, interchange format assembly, conversion, and push to server.

