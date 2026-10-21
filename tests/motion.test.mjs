import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initMotion} from '../src/scripts/motion.js';

function fixture(reduced = false) {
  const root = {dataset: {motion: 'static'}};
  const button = {hidden: true, disabled: false, textContent: '', attributes: {}, setAttribute(key, value) {this.attributes[key] = value;}, addEventListener(type, handler) {this[type] = handler;}};
  const status = {textContent: ''};
  const media = {matches: reduced, addEventListener(type, handler) {this[type] = handler;}};
  const doc = {documentElement: root, querySelector(selector) {return selector === '[data-motion-toggle]' ? button : status;}};
  initMotion(doc, media);
  return {root, button, status, media};
}

test('motion starts only after enhancement; accessible button pauses and resumes', () => {
  const {root, button, status} = fixture();
  assert.equal(root.dataset.motion, 'running');
  assert.equal(button.hidden, false);
  assert.equal(button.textContent, 'Pause motion');
  assert.equal(button.attributes['aria-pressed'], 'false');
  button.click();
  assert.equal(root.dataset.motion, 'paused');
  assert.equal(button.textContent, 'Resume motion');
  assert.equal(button.attributes['aria-pressed'], 'true');
  assert.equal(status.textContent, 'Motion paused.');
  button.click();
  assert.equal(root.dataset.motion, 'running');
});

test('reduced motion is static, disabled, and preserves a manual pause across preference changes', () => {
  const {root, button, media} = fixture(true);
  assert.equal(root.dataset.motion, 'static');
  assert.equal(button.disabled, true);
  button.click();
  assert.equal(root.dataset.motion, 'static');
  media.matches = false; media.change();
  assert.equal(root.dataset.motion, 'running');
  button.click();
  media.matches = true; media.change();
  media.matches = false; media.change();
  assert.equal(root.dataset.motion, 'paused');
});

test('CSS freezes nested meshes, digit strips and pseudo-elements and supplies static fallback', () => {
  const css = readFileSync(new URL('../src/styles/motion.css', import.meta.url), 'utf8');
  assert.match(css, /:root:not\(\[data-motion="running"\]\) \[data-chalkboard-effects\] \*/);
  assert.match(css, /\*::before/);
  assert.match(css, /\*::after/);
  assert.match(css, /animation-play-state:\s*paused\s*!important/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /animation:\s*none\s*!important/);
  const page = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  assert.match(page, /data-motion="static"/);
  assert.match(page, /data-motion-toggle[^>]*hidden/);
  assert.match(page, /aria-live="polite"/);
});
