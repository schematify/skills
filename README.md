# Schematify agent skills

Schematify builds and publishes graph diagrams from TypeScript scripts containing nested nodes, directional links, and optional live data. This repository contains the agent skills for creating and operating those diagrams.

## Install all skills

```bash
npx skills@latest add schematify/skills --skill '*'
```

The installer asks which agent harness to use and whether to install the skills globally or in the current project.

## Skills

| Skill | Use it for |
|---|---|
| **schematify-cli** | Discover CLI commands and inspect or change published Schematify resources. |
| **schematify-graphs** | Create and edit TypeScript graph scripts using the `graph`, `node`, and `channel` builders. |
| **schematify-render** | Configure property cards, reports, and charts through `.render(...)`. |
| **schematify-generate** | Derive a graph from a codebase, directory, dataset, or described system. |

A typical source workflow starts with **schematify-generate**, authors the script with **schematify-graphs**, adds specialized presentation with **schematify-render**, then validates or publishes through **schematify-cli**.
