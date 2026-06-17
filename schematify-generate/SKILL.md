---
name: schematify-generate
description: Turn a codebase, directory, or dataset into a Schematify graph by working out what to map and how to source it. Use when the user asks to generate, create, build, map, or visualize a graph or diagram FROM something — a project, a folder structure, code dependencies, a system architecture, or arbitrary data plus a description.
---

# Schematify Generate

This skill is the **what to map and where to source it** layer — the heuristics for extracting nodes and links from a real source. It does **not** cover graph authoring mechanics; once you know the nodes and links, author and publish the graph with the **schematify-graphs** skill (the `graph`/`node`/`channel` builder and `schematify run`).

## Step 1: Determine what to graph

**If the user already said** ("architecture diagram of this project", "map dependencies in `server/`", "graph this folder structure"), go straight to Step 2.

**If intent is unclear, ask** which they want:

1. **Architecture diagram** — logical components and how they communicate (services, modules, databases, APIs)
2. **Code dependency graph** — file-level import/require relationships
3. **File structure** — the directory tree as a graph
4. **Custom** — describe the entities and relationships to map (from any data source)

The target is the current working directory unless the user specifies otherwise.

## Step 2: Source the nodes and links

Each generation type has its own reconnaissance recipe — what to scan, how to identify nodes, how to map links:

| Generation type | Recipe |
|---|---|
| Architecture | [references/architecture.md](references/architecture.md) |
| Code dependency | [references/dependency.md](references/dependency.md) |
| File structure | [references/file-structure.md](references/file-structure.md) |
| Custom / arbitrary data | [references/generic.md](references/generic.md) |

Read the matching recipe and follow it to produce a **plan**: the list of nodes (with ids, labels, types, hierarchy) and links (from → to).

**Delegate reconnaissance to a subagent** where possible to keep your context clean. If you can't, do it yourself but summarise findings — don't paste raw file contents into working memory.

## Step 3: Author and publish the graph

Hand the plan to the **schematify-graphs** skill. Express the nodes and links with the builder API (`graph(uuid).children([ node(id).label(...).type(...).links([...]) ])`), then run it:

- `schematify run graph.ts` first — capture-by-default, nothing hits the server. Inspect the output.
- Re-run with `--live` **only on explicit user instruction**.

See schematify-graphs for the full API, the capture/live workflow, and bounding loops. Do not hand-assemble document JSON or use legacy `convert`/`push` pipelines — the scriptable builder is the supported path.

## Mapping recon to the builder

The recipes describe nodes and links abstractly. When authoring:

- A node's **id** is unique among its siblings; its **path** is `parent/child` joined with `/`. Containers (folders, layers, groupings) are nodes too.
- **Hierarchy** comes from nesting nodes via `.children([...])`, not a separate `parentId` field.
- **Links** are `.links([targetPath, ...])` on the source node.
- Choose `node.type(...)` from texture-pack ids the user/project uses (e.g. `microservices/service`); fall back to a sensible generic type when unsure.
