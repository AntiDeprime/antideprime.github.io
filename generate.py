import yaml
import json
from jinja2 import Environment, FileSystemLoader
import os

def generate_site():
    # Load configuration
    with open('config.yaml', 'r') as file:
        config = yaml.safe_load(file)

    # Set up Jinja2 environment with custom filters
    env = Environment(loader=FileSystemLoader('.'))
    env.filters['tojson'] = json.dumps

    template = env.get_template('template.html')
    html = template.render(**config)

    # Write output
    with open('index.html', 'w') as file:
        file.write(html)

if __name__ == "__main__":
    generate_site() 