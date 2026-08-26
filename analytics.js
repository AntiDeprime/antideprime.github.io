(function () {
    const CONSENT_KEY = 'analytics-consent';
    const MEASUREMENT_ID = window.GA_MEASUREMENT_ID;
    const consentBanner = document.getElementById('consent-banner');
    const acceptButton = document.getElementById('consent-accept');
    const declineButton = document.getElementById('consent-decline');

    const readConsent = () => {
        try {
            return localStorage.getItem(CONSENT_KEY);
        } catch (error) {
            return null;
        }
    };

    const writeConsent = (value) => {
        try {
            localStorage.setItem(CONSENT_KEY, value);
        } catch (error) {
            // Ignore blocked storage; the choice still applies to this visit.
        }
    };

    const loadAnalytics = () => {
        if (!MEASUREMENT_ID) {
            return;
        }
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', MEASUREMENT_ID);
    };

    const hideBanner = () => {
        if (consentBanner) {
            consentBanner.classList.add('hidden');
        }
    };

    const consent = readConsent();
    if (consent === 'granted') {
        loadAnalytics();
    } else if (consent === null && consentBanner) {
        consentBanner.classList.remove('hidden');
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            writeConsent('granted');
            loadAnalytics();
            hideBanner();
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            writeConsent('denied');
            hideBanner();
        });
    }
})();
