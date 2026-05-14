#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import yaml
from jinja2 import Environment, FileSystemLoader, TemplateNotFound

REQUIRED_FIELDS = ("name", "bio", "summary", "assets", "seo", "theme", "layout", "social")
CONFIG_PATH = Path("config.yaml")
TEMPLATE_PATH = Path("template.html")
OUTPUT_PATH = Path("index.html")
ROBOTS_PATH = Path("robots.txt")
SITEMAP_PATH = Path("sitemap.xml")
LLMS_PATH = Path("llms.txt")
MANIFEST_PATH = Path("site.webmanifest")


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


def enabled_social_links(config: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Return configured social links that should be rendered and indexed."""
    links: dict[str, dict[str, Any]] = {}
    for platform, data in config["social"].items():
        if not isinstance(data, dict) or not data.get("enabled", True) or not data.get("url"):
            continue
        links[platform] = data
    return links


def build_json_ld(
    config: dict[str, Any],
    absolute_assets: dict[str, str],
    social_links: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    """Build structured data for the profile page."""
    site_url = config["seo"]["site_url"].rstrip("/")
    same_as = [
        data["url"]
        for data in social_links.values()
        if data["url"].startswith(("http://", "https://"))
    ]

    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": f"{site_url}/#profile-page",
        "url": f"{site_url}/",
        "name": config["name"],
        "description": config["seo"]["description"],
        "mainEntity": {
            "@type": "Person",
            "@id": f"{site_url}/#person",
            "name": config["name"],
            "url": site_url,
            "image": absolute_assets["avatar"],
            "description": config["summary"],
            "jobTitle": "AI R&D",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Berlin",
                "addressCountry": "Germany",
            },
            "worksFor": {
                "@type": "Organization",
                "name": "Action1",
                "url": "https://www.action1.com",
            },
            "alumniOf": {
                "@type": "Organization",
                "name": "Wrike",
                "url": "https://www.wrike.com",
            },
            "sameAs": same_as,
        },
    }


def display_platform(platform: str) -> str:
    """Return user-facing platform names for generated metadata."""
    return {
        "github": "GitHub",
        "linkedin": "LinkedIn",
    }.get(platform, platform.title())


def write_search_metadata(config: dict[str, Any]) -> None:
    """Write crawl metadata files used by search engines."""
    site_url = config["seo"]["site_url"].rstrip("/")
    social_links = enabled_social_links(config)

    ROBOTS_PATH.write_text(
        "\n".join(
            [
                "User-agent: *",
                "Allow: /",
                f"Sitemap: {site_url}/sitemap.xml",
                f"LLMs: {site_url}/llms.txt",
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

    LLMS_PATH.write_text(
        "\n".join(
            [
                f"# {config['name']}",
                "",
                config["summary"],
                "",
                f"- Canonical URL: {site_url}/",
                f"- Location: Berlin, Germany",
                "- Current work: AI R&D at Action1",
                "- Previous work: Wrike",
                "",
                "## Canonical Links",
                *[
                    f"- {display_platform(platform)}: {data['url']}"
                    for platform, data in social_links.items()
                ],
                "",
            ]
        ),
        encoding="utf-8",
    )

    MANIFEST_PATH.write_text(
        json.dumps(
            {
                "name": config["name"],
                "short_name": config["name"],
                "start_url": "/",
                "display": "minimal-ui",
                "background_color": "#fafafa",
                "theme_color": "#0a0a0a",
                "icons": [
                    {
                        "src": f"/{config['assets']['icon_192']}",
                        "sizes": "192x192",
                        "type": "image/png",
                    },
                    {
                        "src": f"/{config['assets']['icon_512']}",
                        "sizes": "512x512",
                        "type": "image/png",
                    },
                ],
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


def generate_site() -> None:
    """Generate the static site from template and configuration."""
    try:
        config = load_config()
        env = setup_jinja()
        template = env.get_template(TEMPLATE_PATH.name)
        site_url = config["seo"]["site_url"]
        absolute_assets = {
            key: absolute_url(value, site_url)
            for key, value in config["assets"].items()
            if isinstance(value, str)
        }
        social_links = enabled_social_links(config)
        rendered_html = template.render(
            **config,
            social_links=social_links,
            absolute_assets=absolute_assets,
            json_ld=build_json_ld(config, absolute_assets, social_links),
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
