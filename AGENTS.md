# AGENTS.md

## Scope

This file applies to the entire repository unless a deeper `AGENTS.md` overrides it.

## Key Documents

- `README.md`: User-facing and contributor-facing project guide.
- `AGENTS.md`: Repository work rules and completion standards.
- `documents/tasks.md`: Planned tasks, ad-hoc work, and completion log.

## Repository Context

This is a static personal website generated from:

- `config.yaml` (content and settings)
- `template.html` (Jinja template)
- `generate.py` (build script)
- `index.html` (generated output, deployed to GitHub Pages)

Primary stack in this repo: HTML/CSS/JS plus a small Python generator.

## Work Process

- Start by understanding the requested change and inspecting relevant files.
- Ask clarifying questions when requirements are ambiguous or contradictory.
- Prefer small, task-focused changes over broad refactors.
- Keep edits limited to files relevant to the task.
- Avoid introducing new dependencies unless clearly necessary.
- Update docs when behavior or workflow changes:
  - `README.md` for usage/build/deploy/contributor flow.
  - `documents/tasks.md` for task status and completion notes.

## Python and Build Guidance

- Keep Python guidance minimal and repo-specific.
- Use Python 3.11+ (matches `pyproject.toml`).
- Dependency and lockfile source of truth is `pyproject.toml` + `uv.lock`.
- Local setup and generation commands:

```bash
uv sync --locked
uv run python generate.py
```

- The generated output is `index.html` and should reflect `config.yaml` and `template.html` changes.
- If dependencies change, update `pyproject.toml` and refresh `uv.lock`.

## Validation Expectations

Run checks from repo root as applicable to the change:

```bash
uv run python generate.py
```

When dependencies/build tooling are touched, also verify installation still works:

```bash
uv sync --locked
```

If a task introduces new automated checks, document them in `README.md` and apply them consistently.

## Definition of Done

- [ ] Requested changes are implemented and aligned with scope.
- [ ] Site generation works locally with `uv run python generate.py`.
- [ ] `README.md` is updated when setup, behavior, or workflow changes.
- [ ] `documents/tasks.md` is updated:
  - Planned/ad-hoc item status is current.
  - A short completion log entry is added for finished work.
- [ ] No stale references to missing repository documents remain.
