---
name: schematify-generate
description: Generate a Schematify graph document. Use when the user asks to generate, create, or build any kind of graph, diagram, or visualization. Handles intent disambiguation, interchange format assembly, conversion, and push to server.
---

# Schematify Generate

Generate a Schematify graph document from a project, codebase, or user-defined description.

If the schematify-cli skill is not already loaded, invoke /schematify-cli now — this workflow uses CLI commands.

## Step 1: Determine what to graph

Before doing any work, establish **what the user wants to graph**. There are three paths:

**A) The user already told you.** They gave a specific instruction — "generate an architecture diagram of this project", "map the dependencies in server/", or described exactly what they want mapped. Proceed directly to Step 2.

**B) The user's intent is unclear.** Ask them which type of graph they want:

1. **Architecture diagram** — logical components and how they communicate (services, modules, databases, APIs)
2. **Code dependency graph** — file-level import/require relationships
3. **Custom** — describe what you want to map and we'll build it

If they pick 1 or 2, read the corresponding reference file in Step 2. If they pick 3 or describe something freeform, use their description as the basis for reconnaissance and node/link identification — work within the interchange format constraints below, choosing appropriate types from the available vocabulary.

## Step 2: Reconnaissance and node/link identification

The target path is the current working directory unless the user specifies otherwise.

This step varies by graph type.

**For architecture or dependency graphs:** read the appropriate reference file:

| Graph type | Reference |
|---|---|
| Architecture | `references/architecture.md` |
| Code dependency | `references/dependency.md` |

The reference defines what to scan, how to identify nodes, and how to map links. Follow it, then return here for Step 3.

**For custom/freeform graphs:** use the user's description to guide your reconnaissance. Scan the relevant project or information source, identify the entities (nodes) and relationships (links) the user described, and select appropriate types from the vocabulary below. If the user's description is too vague to act on, ask clarifying questions before proceeding.

**Delegate reconnaissance to a subagent** when possible to keep your main context clean. If subagents aren't available, do the work yourself but summarise findings — don't paste raw file contents into working memory.

## Step 3: Assemble interchange JSON

Combine nodes, links, and metadata into the interchange format. This structure is **required for all graph types**.

```json
{
  "nodes": [
    {
      "id": "string — REQUIRED — unique identifier",
      "parentId": "string — REQUIRED for non-root nodes — must match an existing node's id",
      "label": "string — REQUIRED — human-readable display name",
      "type": "string — REQUIRED — see node types below"
    }
  ],
  "links": [
    {
      "fromId": "string — REQUIRED — source node id (must match exactly)",
      "toId": "string — REQUIRED — target node id (must match exactly)",
      "type": "string — REQUIRED — see link types below"
    }
  ],
  "metadata": {
    "source": "string — graph type, e.g. architecture, dependency, or a custom label",
    "rootPath": "string — project name, controls output filename",
    "generatedLabel": "string — descriptive title for the graph"
  }
}
```

### Node types (superset)

| Type | Use for |
|---|---|
| `service` | Backend services, workers, daemons |
| `module` | Libraries, packages, logical modules |
| `database` | Databases, caches, persistent stores |
| `endpoint` | API endpoints, routes, webhooks |
| `folder` | Grouping containers, directories, layers, domains |
| `file` | Individual files, or fallback for anything else |

The reference file for your graph type may constrain which types to use. For custom graphs, pick the types that best fit.

### Link types (superset)

| Type | Use for |
|---|---|
| `calls` | HTTP calls, RPC, message passing, event emission |
| `depends_on` | Runtime dependency, database connection, config dependency |
| `imports` | Code-level imports between modules or files |

### Assembly rules

1. Every non-root node **must** have a `parentId` matching an existing node's `id`.
2. Parent nodes must appear **before** their children in the array.
3. Every link's `fromId` and `toId` must exactly match a node `id`.
4. `metadata.rootPath` is required — it controls the output filename.

### Full example

```json
{
  "nodes": [
    { "id": "frontend", "label": "Frontend", "type": "folder" },
    { "id": "frontend/web-app", "parentId": "frontend", "label": "Web App", "type": "module" },
    { "id": "backend", "label": "Backend", "type": "folder" },
    { "id": "backend/api", "parentId": "backend", "label": "API Gateway", "type": "service" },
    { "id": "backend/auth", "parentId": "backend", "label": "Auth Service", "type": "service" },
    { "id": "data", "label": "Data Layer", "type": "folder" },
    { "id": "data/postgres", "parentId": "data", "label": "PostgreSQL", "type": "database" }
  ],
  "links": [
    { "fromId": "frontend/web-app", "toId": "backend/api", "type": "calls" },
    { "fromId": "backend/api", "toId": "backend/auth", "type": "calls" },
    { "fromId": "backend/auth", "toId": "data/postgres", "type": "depends_on" }
  ],
  "metadata": {
    "source": "architecture",
    "rootPath": "my-project",
    "generatedLabel": "My Project System Architecture"
  }
}
```

## Step 4: Convert to Schematify document

Pipe the interchange JSON through `schematify convert`:

```bash
echo '<interchange json>' | schematify convert --json -
```

- **Do not pass `--id`.** The convert command generates a deterministic UUID automatically.
- The command reads from stdin (`-`) and outputs the Schematify document JSON to stdout.

If convert fails, fix the interchange JSON and retry.

## Step 5: Push to server

Push the converted document to the Schematify server:

```bash
echo '<schematify document json>' | schematify push --json -
```

If push fails due to authentication, run `schematify login` (this opens a browser for the user to authenticate), then retry the push.

## Reference: InterchangeNode

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier. |
| `parentId` | string | For non-root nodes | Must match an existing node's `id`. Creates hierarchy. |
| `label` | string | Yes | Human-readable display name. |
| `type` | string | Yes | One of: `service`, `module`, `database`, `endpoint`, `folder`, `file`. |
| `attributes` | object | No | Optional key-value metadata (displayed on the node). |

## Reference: InterchangeLink

| Field | Type | Required | Description |
|---|---|---|---|
| `fromId` | string | Yes | Source node's `id` (must match exactly). |
| `toId` | string | Yes | Target node's `id` (must match exactly). |
| `type` | string | Yes | One of: `calls`, `depends_on`, `imports`. |
| `label` | string | No | Optional description of the relationship. |
