import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

from generate import load_config, render_index

EXTERNAL_SCHEMES = ("http://", "https://", "mailto:", "data:", "#")


class PageParser(HTMLParser):
    """Collect the facts the structural checks below need."""

    def __init__(self):
        super().__init__()
        self.tags: list[tuple[str, dict[str, str | None]]] = []

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def find(self, tag):
        return [attrs for name, attrs in self.tags if name == tag]


def parse(html: str) -> PageParser:
    parser = PageParser()
    parser.feed(html)
    return parser


class RenderedPageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.config = load_config()
        cls.html = render_index(cls.config)
        cls.page = parse(cls.html)

    def test_document_structure(self):
        self.assertTrue(self.html.startswith("<!DOCTYPE html>"))
        self.assertEqual(self.page.find("html")[0]["lang"], "en")
        self.assertEqual(len(self.page.find("h1")), 1)
        self.assertEqual(len(self.page.find("main")), 1)
        ids = [attrs["id"] for _, attrs in self.page.tags if "id" in attrs]
        self.assertEqual(len(ids), len(set(ids)))

    def test_images_reserve_space_and_have_alt_text(self):
        for img in self.page.find("img"):
            self.assertTrue(img.get("alt"), img)
            self.assertTrue(img.get("width") and img.get("height"), img)

    def test_markup_stays_free_of_inline_styles_and_handlers(self):
        for tag, attrs in self.page.tags:
            self.assertNotIn("style", attrs, tag)
            self.assertFalse([name for name in attrs if name.startswith("on")], tag)

    def test_external_links_do_not_leak_the_opener(self):
        for link in self.page.find("a"):
            if link.get("target") == "_blank":
                self.assertIn("noopener", link.get("rel", ""), link)

    def test_local_references_resolve(self):
        references = []
        for tag, attrs in self.page.tags:
            if tag in {"link", "script", "img", "a"}:
                references += [attrs.get(name) for name in ("href", "src")]
        local = [ref for ref in references if ref and not ref.startswith(EXTERNAL_SCHEMES)]
        self.assertIn("styles.css", local)
        self.assertIn("theme.js", local)
        for ref in local:
            self.assertTrue(Path(urlsplit(ref).path).is_file(), ref)

    def test_stylesheet_font_files_exist(self):
        css = Path("styles.css").read_text(encoding="utf-8")
        files = re.findall(r'url\("(assets/fonts/[^"]+)"\)', css)
        self.assertTrue(files)
        for font in files:
            self.assertTrue(Path(font).is_file(), font)

    def test_every_class_in_the_markup_is_styled(self):
        css = Path("styles.css").read_text(encoding="utf-8")
        styled = set(re.findall(r"\.([a-z][a-z0-9-]*)", css))
        used = {
            name
            for _, attrs in self.page.tags
            for name in (attrs.get("class") or "").split()
        }
        self.assertFalse(used - styled, used - styled)

    def test_preloaded_fonts_are_declared_in_the_stylesheet(self):
        css = Path("styles.css").read_text(encoding="utf-8")
        for link in self.page.find("link"):
            if link.get("rel") == "preload" and link.get("as") == "font":
                self.assertIn(link["href"], css)
                self.assertIn("crossorigin", link)

    def test_theme_colors_match_the_stylesheet_background_token(self):
        colors = self.config["seo"]["theme_color"]
        css = Path("styles.css").read_text(encoding="utf-8")
        self.assertIn(f"--bg: light-dark({colors['light']}, {colors['dark']});", css)
        metas = {
            attrs["media"]: attrs["content"]
            for attrs in self.page.find("meta")
            if attrs.get("name") == "theme-color"
        }
        self.assertEqual(metas["(prefers-color-scheme: light)"], colors["light"])
        self.assertEqual(metas["(prefers-color-scheme: dark)"], colors["dark"])

    def test_analytics_markup_is_present_when_enabled(self):
        self.assertIn('id="analytics-consent"', self.html)
        self.assertIn('data-measurement-id="G-', self.html)
        self.assertIn('src="analytics.js"', self.html)

    def test_analytics_markup_disappears_when_disabled(self):
        config = load_config()
        config["analytics"]["google_measurement_id"] = ""
        html = render_index(config)
        for fragment in ("analytics-consent", "analytics-settings", "analytics.js"):
            self.assertNotIn(fragment, html)


if __name__ == "__main__":
    unittest.main()
