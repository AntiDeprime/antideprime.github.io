# Personal Website

Static personal website generated from a Jinja template and YAML config, then deployed to GitHub Pages.

## Project Overview

This repository renders a single-page website from structured content:

- `config.yaml` stores profile content, SEO fields, theme settings, and social links.
- `template.html` defines the page structure and template logic.
- `generate.py` renders `template.html` with data from `config.yaml`.
- `index.html` is the generated output that gets deployed.
- `styles.css` and `theme.js` provide styling and theme behavior.

## How Generation Works

`generate.py` does the following:

1. Loads and validates required fields from `config.yaml`.
2. Builds a Jinja environment from the repository root.
3. Renders `template.html` with config values.
4. Writes the result to `index.html`.

If required fields are missing or YAML is invalid, generation fails with an error.

## Local Setup and Build

Use Python 3.11+.

Install `uv` (if needed):

```bash
python -m pip install --upgrade uv
```

Sync dependencies from `pyproject.toml`/`uv.lock`:

```bash
uv sync --locked
```

Generate the site:

```bash
uv run python generate.py
```

After running the generator, review `index.html` in a browser.

## Deployment Flow

Deployment is handled by [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml):

1. Triggered on pushes to `main`, pull requests, and manual dispatch.
2. Installs `uv`.
3. Syncs dependencies with `uv sync --locked`.
4. Runs `uv run python generate.py`.
5. Fails if `index.html` is stale relative to source (`template.html` / `config.yaml`).
6. For non-PR events, uploads only deployable site assets as Pages artifact.
7. Deploys to GitHub Pages.

## Contribution Workflow

For any change in behavior, build flow, or contributor process:

1. Update implementation files.
2. Re-generate site output:

```bash
uv run python generate.py
```

3. Update docs as needed:
   - [`AGENTS.md`](./AGENTS.md) for repository process/rules.
   - [`documents/tasks.md`](./documents/tasks.md) for planned/ad-hoc status and completion entries.

Keep changes focused and avoid unrelated refactors.
