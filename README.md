# Schematify agent skills

**This standalone skills repository is deprecated. Install Schematify skills through the CLI instead.**

The CLI now bundles the skills, references, and examples with each release. It installs four small discovery skills that retrieve full instructions from the installed CLI, keeping those instructions matched to its version. The files in this repository remain as legacy reference material and will no longer receive updates.

## Install the CLI and skills

Use the installer shown on your Schematify instance's **CLI & Agent Setup** page. For the hosted service:

Linux and macOS:

```bash
curl -fsSL https://app.schematify.com/install.sh | sh
```

Windows PowerShell:

```powershell
irm https://app.schematify.com/install.ps1 | iex
```

The installer includes the Node runtime; no separate Node.js installation is needed. Supported platforms are Linux x64 and ARM64, macOS Apple Silicon, and Windows x64.

Accept the offer to install agent skills, then select your agents. The installer installs skills for your user. If you already have the current CLI, or prefer project scope, run:

```bash
schematify skills install                  # Choose agents; current project
schematify skills install --global         # Choose agents; current user
```

For unattended selection, use repeatable `--agent` options:

```bash
schematify skills install --global --agent codex --agent claude-code
```

Supported agent IDs are `claude-code`, `codex`, `cursor`, `github-copilot`, `gemini-cli`, `opencode`, and `pi`. For a custom destination, use `schematify skills install --path <skills-directory>` instead.

Installing and reading bundled skills needs no network connection or login. Ensure `schematify` is on your agent's PATH and start a fresh agent session after installation. Remote, cloud, and WSL environments need their own CLI and skills.

## Migrate from this repository

1. Install the current CLI using the installer above. Older installations without `schematify update` or `schematify skills` need the installer once.
2. Replace the old skills at the scope you previously used:

   ```bash
   schematify skills install --force          # Project skills; choose agents
   schematify skills install --global --force # User skills; choose agents
   ```

   Run only the command for your intended scope, or both if you use both. For an existing custom location, use `schematify skills install --path <skills-directory> --force`.
3. Stop updating Schematify skills from this repository through your previous skills manager. Review any warnings about other legacy copies and remove those copies from your agent's discovery paths so they cannot override the new skills.
4. Start a fresh agent session.

The CLI installer does not silently overwrite existing skills. If it reports a skills conflict, the CLI remains installed; use the replacement command above. `--force` replaces only the four named Schematify skill directories at the selected destinations, including their old references. It leaves unrelated skills and the targets of existing symlinks untouched. Copies in other locations are not removed automatically.

## Keep skills current

```bash
schematify update
```

Updating the CLI updates the full instructions returned by `schematify skills get`. Rerun `schematify skills install` at your chosen scope when discovery descriptions change or a new skill is added; use `--force` to replace differing installed skills.

To inspect the bundled skills:

```bash
schematify skills list
schematify skills get schematify-graphs
```

## Skills

| Skill | Use it for |
|---|---|
| **schematify-cli** | Discover CLI commands and inspect or change published Schematify resources. |
| **schematify-graphs** | Create and edit TypeScript graph scripts using the `graph`, `node`, and `channel` builders. |
| **schematify-render** | Configure property cards, reports, and charts through `.render(...)`. |
| **schematify-generate** | Derive a graph from a codebase, directory, dataset, or described system. |

A typical source workflow starts with **schematify-generate**, authors the script with **schematify-graphs**, adds specialized presentation with **schematify-render**, then validates or publishes through **schematify-cli**.
