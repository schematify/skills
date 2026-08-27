# Code dependency

Generate a file-level dependency graph. Source files become nodes and resolved internal imports become directional links.

## What to inspect

Inspect:

- source files,
- import, require, and include statements,
- path aliases and module-resolution configuration,
- entry points when they help explain the graph.

Ignore external packages, generated and vendor directories, build output, lock files, and unrelated assets unless source code imports them.

## Graph model

- **Nodes:** One per source file, nested inside directory nodes.
- **IDs:** Use one path segment per hierarchy level. For `src/utils/auth.ts`, use sibling ids `src`, `utils`, and `auth.ts`. Nesting produces the root-relative graph path `src/utils/auth.ts`.
- **Labels:** Use the filename for files and directory name for containers.
- **Hierarchy:** Match source directory containment with `.children([...])`.
- **Links:** Include every resolved internal import. Link the importing file to the imported file using its root-relative graph path.
- **Resolution:** Resolve aliases, extension rules, and directory indexes before creating links.
