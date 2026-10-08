const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function visit({ consent = null, id = 'G-TEST', blocked = false, bannerPresent = true } = {}) {
    class Element {
        constructor() {
            this.listeners = {};
            this.dataset = {};
            this.hidden = true;
            this.focused = 0;
        }
        addEventListener(type, callback) { this.listeners[type] = callback; }
        closest() { return this; }
        focus() { this.focused += 1; }
    }
    const banner = new Element();
    banner.dataset.measurementId = id;
    const firstButton = new Element();
    banner.querySelector = () => firstButton;
    const settings = new Element();
    const scripts = [];
    const window = {};
    vm.runInNewContext(readFileSync('analytics.js', 'utf8'), {
        window, Element,
        document: {
            getElementById: name => name === 'analytics-settings' ? settings : bannerPresent ? banner : null,
            createElement: () => ({}),
            head: { appendChild: script => scripts.push(script) },
        },
        localStorage: {
            getItem() { if (blocked) throw Error('blocked'); return consent; },
            setItem(key, value) { if (blocked) throw Error('blocked'); consent = value; },
        },
    });
    return {
        banner, settings, firstButton, scripts, window,
        choice(value) {
            const target = new Element();
            target.dataset = { consentChoice: value };
            banner.listeners.click({ target });
        },
        consent: () => consent,
    };
}

test('no tracking before consent; decline persists and settings reopen', () => {
    const page = visit();
    assert.equal(page.banner.hidden, false);
    assert.equal(page.settings.hidden, false);
    assert.equal(page.scripts.length, 0);
    page.choice('denied');
    assert.equal(page.banner.hidden, true);
    assert.equal(page.consent(), 'denied');
    assert.equal(page.scripts.length, 0);
    page.settings.listeners.click();
    assert.equal(page.banner.hidden, false);
});

test('reopening from settings moves focus in, and a choice returns it', () => {
    const page = visit({ consent: 'denied' });
    assert.equal(page.banner.hidden, true);
    page.settings.listeners.click();
    assert.equal(page.firstButton.focused, 1);
    page.choice('granted');
    assert.equal(page.settings.focused, 1);
    page.choice('denied');
    assert.equal(page.settings.focused, 1, 'focus is only restored after a reopen');
});

test('accept, revoke, and accept again without duplicating the tag', () => {
    const page = visit();
    page.choice('granted');
    assert.equal(page.scripts.length, 1);
    assert.equal(page.window['ga-disable-G-TEST'], false);
    page.choice('denied');
    assert.equal(page.window['ga-disable-G-TEST'], true);
    assert.equal(page.window.dataLayer.at(-1)[2].analytics_storage, 'denied');
    page.choice('granted');
    assert.equal(page.window['ga-disable-G-TEST'], false);
    assert.equal(page.window.dataLayer.at(-1)[2].analytics_storage, 'granted');
    assert.equal(page.scripts.length, 1);
});

test('stored choices are respected and unknown values ask again', () => {
    assert.equal(visit({ consent: 'granted' }).scripts.length, 1);
    assert.equal(visit({ consent: 'granted' }).banner.hidden, true);
    assert.equal(visit({ consent: 'denied' }).banner.hidden, true);
    assert.equal(visit({ consent: 'invalid' }).banner.hidden, false);
});

test('analytics stays inert without a banner or measurement id', () => {
    const missing = visit({ bannerPresent: false });
    assert.equal(missing.settings.hidden, true);
    assert.equal(missing.scripts.length, 0);

    const empty = visit({ id: '' });
    assert.equal(empty.banner.hidden, true);
    assert.equal(empty.settings.hidden, true);
    assert.equal(empty.scripts.length, 0);
});

test('blocked storage does not prevent accepting or revoking', () => {
    const page = visit({ blocked: true });
    assert.equal(page.banner.hidden, false);
    page.choice('granted');
    page.choice('denied');
    assert.equal(page.window['ga-disable-G-TEST'], true);
});
