const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function visit({ consent = null, id = 'G-TEST', blocked = false } = {}) {
    class Element {
        constructor() { this.listeners = {}; this.hidden = true; }
        addEventListener(type, callback) { this.listeners[type] = callback; }
        closest() { return this; }
    }
    class Dialog extends Element {
        open = false;
        showModal() { this.open = true; }
        close() { this.open = false; }
    }
    const dialog = new Dialog();
    const settings = new Element();
    const scripts = [];
    const window = { GA_MEASUREMENT_ID: id };
    vm.runInNewContext(readFileSync('analytics.js', 'utf8'), {
        window, Element, HTMLDialogElement: Dialog,
        document: {
            getElementById: id => id === 'analytics-settings' ? settings : dialog,
            createElement: () => ({}),
            head: { appendChild: script => scripts.push(script) },
        },
        localStorage: {
            getItem() { if (blocked) throw Error('blocked'); return consent; },
            setItem(key, value) { if (blocked) throw Error('blocked'); consent = value; },
        },
    });
    return {
        dialog, settings, scripts, window,
        choice(value) {
            const target = new Element();
            target.dataset = { consentChoice: value };
            dialog.listeners.click({ target });
        },
        consent: () => consent,
    };
}

test('no tracking before consent; decline persists and settings reopen', () => {
    const page = visit();
    assert.equal(page.dialog.open, true);
    assert.equal(page.scripts.length, 0);
    page.choice('denied');
    assert.equal(page.dialog.open, false);
    assert.equal(page.consent(), 'denied');
    assert.equal(page.scripts.length, 0);
    page.settings.listeners.click();
    assert.equal(page.dialog.open, true);
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

test('stored choices and disabled analytics', () => {
    assert.equal(visit({ consent: 'granted' }).scripts.length, 1);
    assert.equal(visit({ consent: 'denied' }).dialog.open, false);
    assert.equal(visit({ consent: 'invalid' }).dialog.open, true);
    const disabled = visit({ id: '' });
    assert.equal(disabled.dialog.open, false);
    assert.equal(disabled.settings.hidden, true);
    assert.equal(disabled.scripts.length, 0);
});

test('blocked storage does not prevent accepting or revoking', () => {
    const page = visit({ blocked: true });
    page.choice('granted');
    page.choice('denied');
    assert.equal(page.window['ga-disable-G-TEST'], true);
});
