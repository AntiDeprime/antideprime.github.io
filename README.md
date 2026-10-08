# Aleksei Shchetinin

This repository contains the source for my personal website: [alxy.sh](https://alxy.sh).

The site is a small static profile page with links to my professional and contact profiles.
It is plain HTML and one hand-written stylesheet (`styles.css`, no build step), set in the
self-hosted Geist and Geist Mono variable fonts (`assets/fonts/`, SIL Open Font License).
The page follows the system light or dark scheme, and visitors can override it with the
theme toggle; the choice is remembered in the browser.

Google Analytics 4 is configured through the `analytics.google_measurement_id` setting in
`config.yaml` and only loads after a visitor accepts the non-blocking consent banner.
Visitors can accept or revoke consent through **Analytics settings** in the footer.
Set the measurement ID to an empty string to remove analytics and its consent UI entirely.

## Build

Install dependencies and regenerate the static site from the repository root:

```bash
uv sync --locked
./scripts/build_assets.sh
uv run python generate.py
```

The generated output includes `index.html`, optimized public image assets,
`robots.txt`, `sitemap.xml`, `llms.txt`, and `site.webmanifest`.

Asset generation expects `cwebp`, `ffmpeg` (with `ffprobe`) on `PATH` and reads the source
photo from `src/profile.jpeg` unless another path is passed as the first argument.

For content changes, edit `config.yaml`; for markup, edit `template.html`. Regenerate the
HTML after either change and commit the generated files with the sources. `styles.css`,
`theme.js` and `analytics.js` are maintained directly, not generated. The `seo.theme_color`
pair in `config.yaml` must match the `--bg` token in `styles.css`; a test enforces this.

## Validation and deployment

Run the regression checks before committing:

```bash
uv run python -m unittest discover -s tests
node --test tests/*.test.cjs
```

These check template escaping and missing fields, profile assets and metadata, the
structure of the rendered page (headings, image sizes, link safety, resolvable local
references, font files, theme colors), the theme toggle, and analytics consent (including
revocation and blocked storage). Also check the page in a browser at narrow and desktop
widths, with both themes, with JavaScript disabled, and in print preview.

GitHub Actions builds and tests pull requests. Pushes to `main` also deploy the public
files to GitHub Pages; the source photo and build tools are excluded from deployment.
CI rejects stale generated HTML and search metadata.
