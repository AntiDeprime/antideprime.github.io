const html = document.documentElement;
const toggle = document.getElementById('theme-toggle');

// Initialize theme
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
html.classList.toggle('dark', isDark);

// Toggle theme
toggle.addEventListener('click', () => html.classList.toggle('dark'));

// Sync with system
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', e => html.classList.toggle('dark', e.matches)); 