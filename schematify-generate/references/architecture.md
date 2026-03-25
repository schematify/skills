# Architecture Diagram — Reconnaissance and Identification

Produce a conceptual "whiteboard-style" architecture diagram — logical components and their relationships, **not** a file listing.

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
>
> Do NOT produce interchange JSON.

## Identifying nodes

Each node is a logical component, not a file.

- **Group related files** into single nodes. `src/auth/login.ts`, `src/auth/logout.ts`, `src/auth/token.ts` → one `auth` node (type: `module`). A PostgreSQL connection → one `database` node.
- Use `parentId` for containment (e.g. `routes` module inside an `api` service).
- Think whiteboard, not file tree.

**ID conventions:** Use descriptive, role-based IDs — `auth-service`, `api-gateway`, `user-database`, `frontend/web-app`. Forward slashes for hierarchy. No file paths.

**Node types for this mode:** `service`, `module`, `database`, `endpoint`, `folder`.

### Example

```json
[
  { "id": "frontend", "label": "Frontend", "type": "folder" },
  { "id": "frontend/web-app", "parentId": "frontend", "label": "Web App", "type": "module" },
  { "id": "backend", "label": "Backend", "type": "folder" },
  { "id": "backend/api", "parentId": "backend", "label": "API Gateway", "type": "service" },
  { "id": "backend/auth", "parentId": "backend", "label": "Auth Service", "type": "service" },
  { "id": "database", "label": "Database", "type": "database" }
]
```

## Mapping links

Links show how components communicate and depend on each other. They are **required**.

- `calls` — HTTP calls, RPC, message passing, event emission
- `depends_on` — runtime dependency, database connection, config dependency
- `imports` — code-level imports between modules

Aim for the major communication paths. You don't need every import, but you need the structural relationships that define the architecture.

**Link types for this mode:** `calls`, `depends_on`, `imports`.

### Example

```json
[
  { "fromId": "frontend/web-app", "toId": "backend/api", "type": "calls" },
  { "fromId": "backend/api", "toId": "backend/auth", "type": "calls" },
  { "fromId": "backend/auth", "toId": "database", "type": "depends_on" }
]
```

Set `metadata.source` to `"architecture"`.

**Return to the generate skill for interchange assembly, convert, and push.**
