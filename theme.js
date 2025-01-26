// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Ensure Tailwind is loaded
    if (!window.tailwind) {
        console.error('Tailwind not loaded');
        return;
    }

    // Tailwind Configuration
    window.tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                colors: {
                    mono: {
                        50: '#fafafa',
                        100: '#f5f5f5',
                        200: '#e5e5e5',
                        300: '#d4d4d4',
                        400: '#a3a3a3',
                        500: '#737373',
                        600: '#525252',
                        700: '#404040',
                        800: '#262626',
                        900: '#171717',
                        950: '#0a0a0a',
                    },
                },
                fontFamily: {
                    display: ['Outfit', 'system-ui', 'sans-serif'],
                    body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                },
            }
        }
    };

    // Apply theme before any visual content loads
    const applyTheme = (isDark) => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Initialize theme based on saved preference or system setting
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    applyTheme(savedTheme === 'dark' || (!savedTheme && systemPrefersDark));
    
    // Theme toggle button functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    
    // Listen for system theme changes
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches);
        }
    });
}); 