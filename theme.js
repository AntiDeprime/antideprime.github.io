document.addEventListener('DOMContentLoaded', () => {
    const THEME_KEY = 'theme';
    const DARK_THEME = 'dark';
    const LIGHT_THEME = 'light';
    const themeToggle = document.getElementById('theme-toggle');

    const readStoredTheme = () => {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (error) {
            return null;
        }
    };

    const writeStoredTheme = (theme) => {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (error) {
            // Ignore blocked storage; the current page state still updates.
        }
    };

    const applyTheme = (isDark) => {
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.style.colorScheme = isDark ? DARK_THEME : LIGHT_THEME;

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', String(isDark));
            themeToggle.setAttribute(
                'aria-label',
                isDark ? 'Switch to light mode' : 'Switch to dark mode',
            );
        }
    };

    // The head-inlined script already applied the effective theme.
    applyTheme(document.documentElement.classList.contains(DARK_THEME));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            applyTheme(isDark);
            writeStoredTheme(isDark ? DARK_THEME : LIGHT_THEME);
        });
    }

    if (window.matchMedia) {
        const darkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const onSystemChange = (event) => {
            if (readStoredTheme() === null) {
                applyTheme(event.matches);
            }
        };
        if (typeof darkScheme.addEventListener === 'function') {
            darkScheme.addEventListener('change', onSystemChange);
        } else if (typeof darkScheme.addListener === 'function') {
            darkScheme.addListener(onSystemChange);
        }
    }
});
