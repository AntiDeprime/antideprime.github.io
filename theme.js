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

    const savedTheme = readStoredTheme();

    applyTheme(savedTheme !== LIGHT_THEME);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            applyTheme(isDark);
            writeStoredTheme(isDark ? DARK_THEME : LIGHT_THEME);
        });
    }
});
