import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('source-manifest.json', root), 'utf8'));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const check = (bytes, expected) => assert.equal(digest(bytes), expected);

for (const [path, entry] of Object.entries(manifest.files)) {
  test(`${path} preserves the published SHA-256`, () => {
    check(readFileSync(new URL(path, root)), entry.sha256);
  });
}

test('parity validation rejects a corrupted component', () => {
  const path = 'src/components/WireGlobe.astro';
  const fixture = Buffer.from(readFileSync(new URL(path, root)));
  fixture[0] ^= 1;
  assert.throws(() => check(fixture, manifest.files[path].sha256), assert.AssertionError);
});

test('composition carries no private asset imports and preserves occasional reverse motion', () => {
  const source = readFileSync(new URL('src/components/ChalkboardEffects.astro', root), 'utf8');
  assert.doesNotMatch(source, /astro:assets|\.png|\.webp|\.woff|professor/);
  assert.match(source, /<slot name="background"/);
  assert.match(source, /--shape-direction:reverse/);
  assert.match(source, /animation:shape-breathe 84s/);
  assert.match(source, /animation-duration:42s/);
  assert.equal((source.match(/class="chalk-shape/g) || []).length, 7);
});

test('no animation timers, canvas or tracking added', () => {
  for (const path of ['src/scripts/motion.js', 'src/pages/index.astro']) {
    assert.doesNotMatch(readFileSync(new URL(path, root), 'utf8'), /setInterval|setTimeout|requestAnimationFrame|<canvas|analytics|navigator\.mediaDevices/);
  }
});

test('source checkout parity, including composition data, layout and effect CSS', {skip: !process.env.SOURCE_ROOT}, () => {
  for (const [path, entry] of Object.entries(manifest.files)) {
    const original = readFileSync(join(process.env.SOURCE_ROOT, entry.source));
    if (!entry.sourceSha256) {
      assert.deepEqual(readFileSync(new URL(path, root)), original);
    } else {
      check(original, entry.sourceSha256);
      const derived = readFileSync(new URL(path, root), 'utf8');
      const source = original.toString();
      const calculations = text => text.slice(text.indexOf('const calculations:'), text.indexOf('\n---', text.indexOf('const calculations:')));
      const layer = text => text.slice(text.indexOf('    <div class="calculation-layer"'), text.indexOf('\n<style>'));
      const effects = text => text.slice(text.indexOf('    .calculation-layer{'));
      assert.equal(calculations(derived), calculations(source));
      assert.equal(layer(derived), layer(source));
      assert.equal(effects(derived), effects(source));
    }
  }
});
