# Code Dependency Graph — Reconnaissance and Identification

Produce a file-level dependency graph where **every source file is a node** and **every internal import/require/include is a link**. The output is a **plan** (nodes + links) that you author with the schematify-graphs builder.

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

## Identifying nodes

One node per source file, plus container nodes for directories.

- **ID:** file's relative path from project root (`src/utils/auth.ts`); directories use the directory path (`src/utils`).
- **Label:** filename without extension (`auth`).
- **Hierarchy:** nest each file/directory node inside its parent directory node via `.children([...])`.

**Suggested node types:** a folder/group type for directories, a file type for files.

### Example plan

```
- src (folder)
  - index.ts (file)
  - utils (folder)
    - auth.ts (file)
    - http.ts (file)
```

## Mapping links

Every resolved **internal** import becomes a link.

- Source = the file containing the import; target = the file being imported (use the node's full path).
- **Only internal** file-to-file imports. Exclude external packages (`lodash`, `react`, `scala.collection`, etc.).
- If an import resolves to a directory index (`import from "./utils"` → `./utils/index.ts`), link to the resolved file.

### Example links

```
src/index.ts      → src/utils/auth.ts
src/index.ts      → src/utils/http.ts
src/utils/auth.ts → src/utils/http.ts
```

Large repos produce large graphs — this is expected for dependency mode.

**Return to the schematify-generate skill (Step 3) to author the plan with schematify-graphs.**
