#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import yaml
from jinja2 import Environment, FileSystemLoader, TemplateNotFound

REQUIRED_FIELDS = ("name", "photo", "bio", "seo", "theme", "layout", "social")
CONFIG_PATH = Path("config.yaml")
TEMPLATE_PATH = Path("template.html")
OUTPUT_PATH = Path("index.html")
ROBOTS_PATH = Path("robots.txt")
SITEMAP_PATH = Path("sitemap.xml")


def load_config(path: Path = CONFIG_PATH) -> dict[str, Any]:
    """Load and validate configuration from YAML file."""
    try:
        config = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as e:
        print(f"Error parsing {path}: {e}", file=sys.stderr)
        sys.exit(1)
    except FileNotFoundError:
        print(f"Config file not found: {path}", file=sys.stderr)
        sys.exit(1)
    except OSError as e:
        print(f"Error reading {path}: {e}", file=sys.stderr)
        sys.exit(1)

    if config is None:
        print(f"Configuration file is empty: {path}", file=sys.stderr)
        sys.exit(1)

    if not isinstance(config, dict):
        print(
            f"Invalid config format in {path}: expected a YAML mapping at the root.",
            file=sys.stderr,
        )
        sys.exit(1)

    missing = [field for field in REQUIRED_FIELDS if field not in config]
    if missing:
        print(
            f"Missing required fields in {path}: {', '.join(missing)}",
            file=sys.stderr,
        )
        sys.exit(1)

    return config


def setup_jinja(template_path: str = ".") -> Environment:
    """Set up Jinja2 environment with custom filters."""
    env = Environment(loader=FileSystemLoader(template_path))
    env.filters["tojson"] = lambda value: json.dumps(value, ensure_ascii=False)
    return env


def absolute_url(value: str, site_url: str) -> str:
    """Return an absolute URL for local assets and leave absolute URLs unchanged."""
    if value.startswith(("http://", "https://")):
        return value

    base_url = site_url.rstrip("/") + "/"
    return urljoin(base_url, value.lstrip("/"))


def write_search_metadata(config: dict[str, Any]) -> None:
    """Write crawl metadata files used by search engines."""
    site_url = config["seo"]["site_url"].rstrip("/")

    ROBOTS_PATH.write_text(
        "\n".join(
            [
                "User-agent: *",
                "Allow: /",
                f"Sitemap: {site_url}/sitemap.xml",
                "",
            ]
        ),
        encoding="utf-8",
    )

    SITEMAP_PATH.write_text(
        "\n".join(
            [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                "  <url>",
                f"    <loc>{site_url}/</loc>",
                "    <priority>1.0</priority>",
                "  </url>",
                "</urlset>",
                "",
            ]
        ),
        encoding="utf-8",
    )


def generate_site() -> None:
    """Generate the static site from template and configuration."""
    try:
        config = load_config()
        env = setup_jinja()
        template = env.get_template(TEMPLATE_PATH.name)
        rendered_html = template.render(
            **config,
            absolute_photo_url=absolute_url(config["photo"], config["seo"]["site_url"]),
        )
        html = "\n".join(line.rstrip() for line in rendered_html.splitlines()) + "\n"
        OUTPUT_PATH.write_text(html, encoding="utf-8")
        write_search_metadata(config)
        print(f"Successfully generated {OUTPUT_PATH}")
    except TemplateNotFound:
        print(f"Template file not found: {TEMPLATE_PATH}", file=sys.stderr)
        sys.exit(1)
    except OSError as e:
        print(f"File system error while generating site: {e}", file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(f"Error generating site: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    generate_site()
