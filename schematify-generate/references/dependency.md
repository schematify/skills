# Code Dependency Graph — Reconnaissance and Identification

Produce a file-level dependency graph where **every source file is a node** and **every import/require/include is a link**.

## Reconnaissance

Delegate to a subagent where possible.

> Scan the project at `<TARGET_PATH>` and produce a complete inventory of source files and their import relationships. Map every file and every import — do not summarise into logical components.
>
> **What to read:**
> 1. Glob the full file tree (`**/*` from the target path)
> 2. Config files for path aliases and module resolution: tsconfig.json, package.json, webpack/vite config, build.sbt, Cargo.toml, go.mod, etc.
> 3. For every source file, extract import/require/include statements and resolve to actual file paths
> 4. Track entry points (main files, index files, test runners)
>
> **Ignore:** node_modules, .git, dist, build, __pycache__, .venv, .DS_Store, coverage, .next, .svelte-kit, target, vendor, lock files, generated files
>
> **Source file extensions:** .ts, .tsx, .js, .jsx, .svelte, .vue, .scala, .java, .py, .go, .rs, .rb, .css, .scss (if imported by source files)
>
> **Produce:** A structured inventory:
> - Project name and root path
> - Complete list of source files with relative paths
> - For each file: resolved imports (mapped to relative file paths, not package names)
> - Path aliases or module resolution rules discovered (e.g. `@/` → `src/`)
> - Entry points identified
>
> Do NOT produce interchange JSON.

## Identifying nodes

One node per source file. Create `folder` nodes for directory containment.

- **ID:** File's relative path from project root (`src/utils/auth.ts`)
- **Label:** Filename without extension (`auth`)
- **parentId:** Parent directory node ID

**ID conventions:** File paths relative to project root, forward slashes. Directory nodes use directory path (`src/utils`), file nodes use full relative path (`src/utils/auth.ts`).

**Node types for this mode:** `folder`, `file`.

### Example

```json
[
  { "id": "src", "label": "src", "type": "folder" },
  { "id": "src/index.ts", "parentId": "src", "label": "index", "type": "file" },
  { "id": "src/utils", "parentId": "src", "label": "utils", "type": "folder" },
  { "id": "src/utils/auth.ts", "parentId": "src/utils", "label": "auth", "type": "file" },
  { "id": "src/utils/http.ts", "parentId": "src/utils", "label": "http", "type": "file" }
]
```

## Mapping links

Every resolved internal import becomes a link.

- `fromId` is the file containing the import statement
- `toId` is the file being imported
- Only **internal** imports (file-to-file within the project). Exclude external packages (`lodash`, `react`, `scala.collection`, etc.)
- If an import resolves to a directory index (`import from "./utils"` → `./utils/index.ts`), link to the resolved file

**Link types for this mode:** `imports` only.

### Example

```json
[
  { "fromId": "src/index.ts", "toId": "src/utils/auth.ts", "type": "imports" },
  { "fromId": "src/index.ts", "toId": "src/utils/http.ts", "type": "imports" },
  { "fromId": "src/utils/auth.ts", "toId": "src/utils/http.ts", "type": "imports" }
]
```

Set `metadata.source` to `"dependency"`.

**Return to the generate skill for interchange assembly, convert, and push.**
