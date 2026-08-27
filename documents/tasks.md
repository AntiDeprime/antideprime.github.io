# Tasks

## Planned Tasks

- [ ] Keep this list for scoped, pre-planned work items.

## Ad-hoc Tasks

- [x] Migrate repository workflow from `pip`/`requirements.txt` to `uv`.
- [x] Harden Tailwind/runtime config loading, generator validation, and Pages workflow checks.
- [x] Fix Firefox dark-mode toggle regression, clean layout spacing, and add search/social preview metadata.
- [x] Simplify `README.md` into a visitor-facing personal website note.
- [x] Upgrade the personal page with optimized assets, static Tailwind CSS, richer profile metadata, and LLM-readable site facts.
- [x] Add Google Analytics 4 tracking for the production website.
- [x] Full project review: restore CSS lost to Tailwind content scan, derive metadata from config, unblock theme toggle on mobile, self-host fonts with consent-gated analytics, deduplicate CI jobs, and clean up dead code/config.
- [x] Test desktop/mobile behavior, repair the consent dialog, and simplify duplicated content and client-side state handling.

## Completion Log

- 2026-04-23: Initialized task tracker structure.
- 2026-04-23: Migrated docs and GitHub Actions workflow to `uv`; removed `requirements.txt`.
- 2026-04-23: Added generated-output CI guard, narrowed Pages artifact contents, and simplified CSS/JS runtime behavior.
- 2026-05-12: Restored dark-first theme behavior, tightened profile card spacing, added canonical/social/JSON-LD metadata, and generated `robots.txt`/`sitemap.xml`.
- 2026-05-12: Removed setup and contributor workflow details from `README.md`.
- 2026-05-14: Added optimized metadata assets, static Tailwind build output, ProfilePage JSON-LD, GitHub profile link, `llms.txt`, and manifest/icon support.
- 2026-05-14: Updated the profile summary copy to a first-person AI leadership positioning.
- 2026-07-22: Added configurable Google Analytics 4 tracking and updated the measurement ID to `G-JWD1WMJEDF`.
- 2026-08-26: Repaired link-hover/bio styles that Tailwind's content scan silently dropped, moved employment/location/theme colors into `config.yaml`, made the theme toggle work on mobile, self-hosted fonts, gated analytics behind a consent banner, merged the duplicate CI jobs in favor of a single build with `setup-uv`, and removed dead config/markup (keywords meta, `og:image:secure_url`, unused platforms, boilerplate project description).
- 2026-08-26: Bumped transitive `postcss` to 8.5.26 and `nanoid` to 3.3.18 to clear the two open Dependabot alerts; rebuilt `styles.css` with the updated toolchain.
- 2026-08-26: Reworked consent UI into a bottom sheet on mobile with a centered dialog on desktop, and moved the theme toggle into the profile card so no control overlaps page content; restored vertical centering on mobile.
- 2026-08-27: Replaced the conflicting responsive consent overlay with an accessible native modal, made analytics loading idempotent, enabled template autoescaping, removed duplicated employment markup from config, simplified theme state updates, and verified desktop/mobile behavior in the browser.
