/** Progressive enhancement: CSS owns every animation; this only selects a state.
 * @param {Document} doc
 * @param {MediaQueryList} preference
 */
export function initMotion(doc, preference) {
  const button = /** @type {HTMLButtonElement | null} */ (doc.querySelector('[data-motion-toggle]'));
  const status = doc.querySelector('[data-motion-status]');
  if (!button || !status) return;
  let paused = false;
  function update() {
    const reduced = preference.matches;
    doc.documentElement.dataset.motion = reduced ? 'static' : paused ? 'paused' : 'running';
    button.disabled = reduced;
    button.textContent = reduced ? 'Motion off (system preference)' : paused ? 'Resume motion' : 'Pause motion';
    button.setAttribute('aria-pressed', String(reduced || paused));
    status.textContent = reduced ? 'Motion is off to respect your reduced motion preference.' : paused ? 'Motion paused.' : 'Motion running.';
  }
  button.addEventListener('click', () => {
    if (preference.matches) return;
    paused = !paused;
    update();
  });
  preference.addEventListener('change', update);
  button.hidden = false;
  update();
}
