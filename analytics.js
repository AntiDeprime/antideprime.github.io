(function () {
    const CONSENT_KEY = 'analytics-consent';
    const MEASUREMENT_ID = window.GA_MEASUREMENT_ID;
    const consentDialog = document.getElementById('analytics-consent-dialog');
    let analyticsLoaded = false;

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
        if (!MEASUREMENT_ID || analyticsLoaded) {
            return;
        }
        analyticsLoaded = true;

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

    const showConsentDialog = () => {
        if (consentDialog instanceof HTMLDialogElement && !consentDialog.open) {
            consentDialog.showModal();
        }
    };

    if (consentDialog instanceof HTMLDialogElement) {
        consentDialog.addEventListener('click', (event) => {
            if (!(event.target instanceof Element)) {
                return;
            }

            const choiceButton = event.target.closest('[data-consent-choice]');
            if (!choiceButton) {
                return;
            }

            const choice = choiceButton.dataset.consentChoice;
            if (choice !== 'granted' && choice !== 'denied') {
                return;
            }

            writeConsent(choice);
            consentDialog.close();

            if (choice === 'granted') {
                loadAnalytics();
            }
        });
    }

    const consent = readConsent();
    if (consent === 'granted') {
        loadAnalytics();
    } else if (consent === null) {
        showConsentDialog();
    }
})();
