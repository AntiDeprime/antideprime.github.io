# Personal Website

A minimalist personal website built with HTML, Tailwind CSS, and Python, following Swiss/Bauhaus design principles.

## Features

- 🌓 Dark/Light mode with smooth transitions
- 📱 Fully responsive design
- 🎨 Clean, geometric aesthetic
- ⚡️ Fast and lightweight
- 🔄 Automated builds with GitHub Actions

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/personal-website.git
cd personal-website
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Edit the configuration in `config.yaml` to customize your website.

4. Generate the HTML:
```bash
python generate.py
```

5. Open `index.html` in your browser to preview changes.

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process:

1. Generates fresh HTML from the template and configuration
2. Deploys the result to GitHub Pages
3. Makes the site available at `https://yourusername.github.io/personal-website`

### Setting up GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the sidebar
3. Under "Build and deployment":
   - Source: "GitHub Actions"
   - Branch: `main`
4. Wait for the first deployment to complete

## Customization

Edit `config.yaml` to customize:
- Personal information
- SEO metadata
- Theme colors
- Layout settings
- Social links

The template will automatically update when you push changes to GitHub.

## License

MIT License - feel free to use this for your own personal website! 