# File Structure

Generate the directory tree as a graph. Containment is the structure; links are usually absent.

## Recon

Walk the target directory and capture files/directories with relative paths and parent/child containment.

Ignore generated/vendor/build directories by default. Honor user-specified depth or include/exclude rules.

## Plan

- **Nodes:** one per directory and file.
- **IDs:** relative paths from the root: `src/utils/auth.ts`.
- **Labels:** basename; keep extensions for files.
- **Hierarchy:** nest entries inside parent directories via `.children([...])`.
- **Links:** none unless the user explicitly asks for an overlay such as imports.

For huge trees, use the requested scope or a sensible bounded scope and state what was included.

Return the node plan to `schematify-generate` for graph authoring.
