const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function visit({ systemDark = false, saved = null, blocked = false, toggle = true } = {}) {
    const root = { dataset: {} };
    if (saved) {
        root.dataset.theme = saved;
    }
    const button = {
        hidden: true,
        attributes: {},
        listeners: {},
        setAttribute(name, value) { this.attributes[name] = value; },
        addEventListener(type, callback) { this.listeners[type] = callback; },
    };
    const metas = [{ content: '#f6f6f3' }, { content: '#0b0d0e' }];
    const system = {
        matches: systemDark,
        listeners: {},
        addEventListener(type, callback) { this.listeners[type] = callback; },
    };
    const storage = {};
    vm.runInNewContext(readFileSync('theme.js', 'utf8'), {
        window: { matchMedia: () => system },
        document: {
            documentElement: root,
            body: {},
            getElementById: () => (toggle ? button : null),
            querySelectorAll: () => metas,
        },
        getComputedStyle: () => ({
            backgroundColor: root.dataset.theme === 'dark' ? 'rgb(11, 13, 14)' : 'rgb(246, 246, 243)',
        }),
        localStorage: {
            setItem(key, value) { if (blocked) throw Error('blocked'); storage[key] = value; },
        },
    });
    return { root, button, metas, system, storage };
}

test('the toggle appears and reflects the system scheme', () => {
    const light = visit();
    assert.equal(light.button.hidden, false);
    assert.equal(light.button.attributes['aria-pressed'], 'false');
    assert.equal(visit({ systemDark: true }).button.attributes['aria-pressed'], 'true');
});

test('a saved theme overrides the system scheme', () => {
    const page = visit({ saved: 'dark' });
    assert.equal(page.button.attributes['aria-pressed'], 'true');
});

test('clicking flips the theme, remembers it, and updates the browser color', () => {
    const page = visit();
    page.button.listeners.click();
    assert.equal(page.root.dataset.theme, 'dark');
    assert.equal(page.storage.theme, 'dark');
    assert.equal(page.button.attributes['aria-pressed'], 'true');
    assert.deepEqual(page.metas.map(meta => meta.content), ['rgb(11, 13, 14)', 'rgb(11, 13, 14)']);
    page.button.listeners.click();
    assert.equal(page.root.dataset.theme, 'light');
    assert.equal(page.button.attributes['aria-pressed'], 'false');
});

test('blocked storage does not prevent switching', () => {
    const page = visit({ blocked: true });
    page.button.listeners.click();
    assert.equal(page.root.dataset.theme, 'dark');
    assert.equal(page.button.attributes['aria-pressed'], 'true');
});

test('system changes update the toggle until a theme is chosen', () => {
    const page = visit();
    page.system.matches = true;
    page.system.listeners.change();
    assert.equal(page.button.attributes['aria-pressed'], 'true');
});

test('the script does nothing without a toggle', () => {
    const page = visit({ toggle: false });
    assert.deepEqual(page.system.listeners, {});
});
