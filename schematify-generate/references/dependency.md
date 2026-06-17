# Code Dependency

Generate a file-level dependency graph: source files as nodes, resolved internal imports as links.

## Recon

Inspect the target for:

- source files
- import/require/include statements
- path aliases and module resolution config
- entry points, if useful for graph layout/context

Ignore external packages, generated/vendor/build directories, lock files, and unrelated assets unless imported by source.

## Plan

- **Nodes:** one per source file, plus directory containers.
- **IDs:** relative paths from project root: `src/utils/auth.ts`; directories use their path.
- **Labels:** filename for files; directory name for containers.
- **Hierarchy:** directories/files nested via `.children([...])`.
- **Links:** every resolved internal import, source file → target file path.
- Resolve aliases and directory indexes before linking.

Return the node/link plan to `schematify-generate` for graph authoring.
