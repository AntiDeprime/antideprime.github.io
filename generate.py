#!/usr/bin/env python3
from typing import Dict, Any
import yaml
import json
from jinja2 import Environment, FileSystemLoader, Template
import os
import sys

def load_config(path: str = 'config.yaml') -> Dict[str, Any]:
    """Load and validate configuration from YAML file."""
    try:
        with open(path, 'r', encoding='utf-8') as file:
            config = yaml.safe_load(file)
            
        # Validate required fields
        required_fields = ['name', 'photo', 'bio', 'seo', 'theme', 'layout', 'social']
        missing = [field for field in required_fields if field not in config]
        if missing:
            raise ValueError(f"Missing required fields in config: {', '.join(missing)}")
            
        return config
    except yaml.YAMLError as e:
        print(f"Error parsing config.yaml: {e}", file=sys.stderr)
        sys.exit(1)
    except FileNotFoundError:
        print(f"Config file not found: {path}", file=sys.stderr)
        sys.exit(1)

def setup_jinja(template_path: str = '.') -> Environment:
    """Set up Jinja2 environment with custom filters."""
    env = Environment(loader=FileSystemLoader(template_path))
    env.filters['tojson'] = json.dumps
    return env

def generate_site() -> None:
    """Generate the static site from template and configuration."""
    try:
        # Load configuration
        config = load_config()

        # Set up Jinja2 environment
        env = setup_jinja()
        template = env.get_template('template.html')
        
        # Render HTML
        html = template.render(**config)

        # Write output
        output_path = 'index.html'
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write(html)
            
        print(f"Successfully generated {output_path}")
        
    except Exception as e:
        print(f"Error generating site: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    generate_site() 