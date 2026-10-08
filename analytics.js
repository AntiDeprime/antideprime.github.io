(() => {
    const CONSENT_KEY = 'analytics-consent';
    const banner = document.getElementById('analytics-consent');
    const measurementId = banner?.dataset.measurementId;

    if (!banner || !measurementId) {
        return;
    }

    const settingsButton = document.getElementById('analytics-settings');
    let analyticsLoaded = false;
    let openedFromSettings = false;

    const readConsent = () => {
        try {
            return localStorage.getItem(CONSENT_KEY);
        } catch {
            return null;
        }
    };

    const writeConsent = (value) => {
        try {
            localStorage.setItem(CONSENT_KEY, value);
        } catch {
            // Ignore blocked storage; the choice still applies to this visit.
        }
    };

    const loadAnalytics = () => {
        window[`ga-disable-${measurementId}`] = false;
        if (analyticsLoaded) {
            window.gtag('consent', 'update', { analytics_storage: 'granted' });
            return;
        }
        analyticsLoaded = true;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', measurementId);
    };

    const showBanner = () => {
        banner.hidden = false;
    };

    if (settingsButton) {
        settingsButton.hidden = false;
        settingsButton.addEventListener('click', () => {
            openedFromSettings = true;
            showBanner();
            banner.querySelector('button')?.focus();
        });
    }

    banner.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) {
            return;
        }

        const choice = event.target.closest('[data-consent-choice]')?.dataset.consentChoice;
        if (choice !== 'granted' && choice !== 'denied') {
            return;
        }

        writeConsent(choice);
        banner.hidden = true;
        if (openedFromSettings) {
            openedFromSettings = false;
            settingsButton?.focus();
        }

        if (choice === 'granted') {
            loadAnalytics();
        } else if (analyticsLoaded) {
            // Stop collection immediately, even when storage is unavailable.
            window[`ga-disable-${measurementId}`] = true;
            window.gtag('consent', 'update', { analytics_storage: 'denied' });
        }
    });

    const consent = readConsent();
    if (consent === 'granted') {
        loadAnalytics();
    } else if (consent !== 'denied') {
        showBanner();
    }
})();
