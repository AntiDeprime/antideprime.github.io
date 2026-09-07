import json
import unittest
from pathlib import Path
from urllib.parse import urlsplit

from jinja2 import UndefinedError

from generate import build_json_ld, enabled_social_links, load_config, setup_jinja


class GeneratorTests(unittest.TestCase):
    def test_missing_template_fields_fail_instead_of_silently_disappearing(self):
        with self.assertRaises(UndefinedError):
            setup_jinja().from_string('{{ social.label }}').render(social={})

    def test_html_and_structured_data_escape_untrusted_text(self):
        payload = '</script><script>alert("x")</script>'
        env = setup_jinja()
        self.assertNotIn('<script>', env.from_string('{{ value }}').render(value=payload))
        rendered = env.from_string('{{ value | tojson }}').render(value={'name': payload})
        self.assertNotIn('</script>', rendered)
        self.assertEqual(json.loads(rendered)['name'], payload)

    def test_disabled_links_are_excluded_from_profile_metadata(self):
        config = load_config()
        config['social']['github']['enabled'] = False
        links = enabled_social_links(config)
        self.assertNotIn('github', links)
        data = build_json_ld(config, {'avatar': 'https://example.com/avatar.webp'}, links)
        self.assertNotIn(config['social']['github']['url'], data['mainEntity']['sameAs'])
        self.assertTrue(all(url.startswith('https://') for url in data['mainEntity']['sameAs']))

    def test_configured_public_assets_exist(self):
        for asset in load_config()['assets'].values():
            self.assertTrue(Path(urlsplit(asset).path).is_file(), asset)


if __name__ == '__main__':
    unittest.main()
