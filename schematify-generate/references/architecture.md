# Architecture Diagram — Reconnaissance and Identification

Produce a conceptual "whiteboard-style" architecture diagram — logical components and their relationships, **not** a file listing. The output of this recipe is a **plan** (nodes + links) that you author with the schematify-graphs builder.

## Reconnaissance

Delegate to a subagent where possible.

> Scan the project at `<TARGET_PATH>` and produce a structured summary of its architecture. Identify major components, not individual files.
>
> **What to read:**
> 1. Glob the project layout (`**/*` from the target path)
> 2. Entry points: main files, index files, app files
> 3. Config files: package.json, tsconfig, docker-compose, build configs (build.sbt, Cargo.toml, go.mod, etc.)
> 4. README or documentation files
> 5. Skim key source directories — read 2-3 representative files per major directory
> 6. API route definitions, database connection setup, external service integrations
>
> **Ignore:** node_modules, .git, dist, build, __pycache__, .venv, .DS_Store, coverage, .next, .svelte-kit, target, vendor
>
> **Produce:** A structured summary:
> - Project name and type (monorepo, single app, microservices, etc.)
> - Logical components: name, purpose, type, corresponding directories/files
> - Observed relationships: which components call, import, or depend on which others
> - Grouping or layering (e.g. "frontend" containing "web-app" and "admin-panel")

## Identifying nodes

Each node is a logical component, not a file.

- **Group related files** into single nodes. `src/auth/login.ts`, `src/auth/logout.ts`, `src/auth/token.ts` → one `auth` node. A PostgreSQL connection → one `database` node.
- Use **nesting** for containment (e.g. a `routes` module inside an `api` service) — express it with `.children([...])` when authoring.
- Think whiteboard, not file tree.

**ID conventions:** descriptive, role-based ids — `auth-service`, `api-gateway`, `user-database`. Unique among siblings.

**Suggested node types:** service, module, database, endpoint, and grouping/folder containers. Use texture-pack ids the project uses (e.g. `microservices/service`, `microservices/database`); fall back to a sensible generic type when unsure.

### Example plan

```
- frontend (group)
  - web-app  (module)
- backend (group)
  - api      (service)
  - auth     (service)
- database   (database)
```

## Mapping links

Links show how components communicate and depend on each other. They are **required** — aim for the major communication paths, not every import.

- A call/HTTP/RPC/event path, a runtime/config dependency, or a key code import.
- Express each as a link on the source node to the target's path (`.links(["backend/api"])`).

### Example links

```
web-app  → backend/api
api      → backend/auth
auth     → database
```

**Return to the schematify-generate skill (Step 3) to author the plan with schematify-graphs.**
