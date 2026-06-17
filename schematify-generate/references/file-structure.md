# File Structure — Reconnaissance and Identification

Produce a graph of the directory tree itself: **every directory and file is a node**, nested by containment. Unlike the dependency graph, there are usually **no links** — the structure *is* the hierarchy. The output is a **plan** you author with the schematify-graphs builder.

## Reconnaissance

Delegate to a subagent where possible.

> Walk the directory tree at `<TARGET_PATH>` and produce its structure.
>
> **What to capture:**
> 1. Every directory and file, with relative paths from the root
> 2. The parent/child containment of each entry
>
> **Ignore by default** (unless the user asks otherwise): node_modules, .git, dist, build, __pycache__, .venv, .DS_Store, coverage, .next, .svelte-kit, target, vendor, lock files
>
> **Honor depth limits** if the user gives one (e.g. "top two levels only").
>
> **Produce:** the tree as a nested list of directories and files with relative paths.

## Identifying nodes

- **One node per directory and per file.**
- **ID:** relative path from root (`src/utils`, `src/utils/auth.ts`).
- **Label:** the entry's own name (`utils`, `auth.ts`) — keep the extension for files so the tree reads naturally.
- **Hierarchy:** nest each node inside its parent directory via `.children([...])`.

**Suggested node types:** a folder/group type for directories, a file type for files.

### Example plan

```
- src (folder)
  - index.ts (file)
  - components (folder)
    - Button.tsx (file)
    - Card.tsx (file)
  - utils (folder)
    - auth.ts (file)
```

## Links

Usually none. Add links only if the user explicitly wants to overlay a relationship (e.g. "and show which files import which") — in that case combine with the dependency recipe.

## Scope guidance

Whole repos can be enormous. If the user hasn't bounded it, prefer a sensible scope (e.g. the working directory, a couple of levels deep, ignoring vendored/build output) and tell the user what you included.

**Return to the schematify-generate skill (Step 3) to author the plan with schematify-graphs.**
