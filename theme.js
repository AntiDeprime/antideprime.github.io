(() => {
    const THEME_KEY = 'theme';
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (!toggle) {
        return;
    }

    // data-theme is only present once a visitor has chosen; otherwise CSS follows the system.
    const currentTheme = () => root.dataset.theme ?? (systemDark.matches ? 'dark' : 'light');

    const syncToggle = () => {
        toggle.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
    };

    // The static theme-color tags follow the system scheme; align them with a manual choice.
    const syncBrowserColor = () => {
        const color = getComputedStyle(document.body).backgroundColor;
        for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
            meta.content = color;
        }
    };

    toggle.hidden = false;
    syncToggle();

    toggle.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        try {
            localStorage.setItem(THEME_KEY, next);
        } catch {
            // Ignore blocked storage; the choice still applies to this visit.
        }
        syncToggle();
        syncBrowserColor();
    });

    systemDark.addEventListener('change', syncToggle);
})();
