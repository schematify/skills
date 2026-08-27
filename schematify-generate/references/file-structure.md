# File structure

Generate a directory tree as a graph. Parent-child containment carries the meaning, so links are usually unnecessary.

## What to inspect

Walk the requested directory and record files and directories with their parent-child relationships. Ignore generated, vendor, and build directories by default. Honor any requested depth and include or exclude rules.

## Graph model

- **Nodes:** One per directory and file.
- **IDs:** Use the basename at each hierarchy level. For `src/utils/auth.ts`, use sibling ids `src`, `utils`, and `auth.ts`. Nesting produces the root-relative graph path `src/utils/auth.ts`.
- **Labels:** Use the basename and keep file extensions.
- **Hierarchy:** Nest every entry under its parent with `.children([...])`.
- **Links:** Add none unless the user asks for another relationship, such as imports.

For a large tree, use the requested scope or choose a clear bounded scope and state what was included.
