# BadBob Vector Lab

CSS wire shapes and occasional chalkboard equations from [BadBob](https://badbob.ai), packaged as reusable Astro components. The demo builds to a static site. The shapes use HTML, SVG and CSS 3D transforms; there is no canvas or animation timer.

## Run locally

Requires Node.js 22.19 or newer.

```sh
npm ci
npm run dev
```

Open the URL printed by Astro. For a production preview:

```sh
npm test
npm run check
npm run build
npm run preview
```

On Johan's development machine, keep the checkout, build output and install cache on `/Volumes/DiceScoreDev`; for example, add `--cache /Volumes/DiceScoreDev/Caches/npm` to `npm ci`. Other machines can use their usual local checkout and npm cache. No hosting or NPM package publication is configured; `private: true` prevents accidental package publication.

## Use the composition

Copy `src/components/` into an Astro project. `ChalkboardEffects` supplies the original calculation placements, perspective, typography, appearance cycles and nested shapes, without requiring an image:

```astro
---
import ChalkboardEffects from './components/ChalkboardEffects.astro';
import './styles/motion.css';
---
<html lang="en" data-motion="static">
  <!-- Your page content and motion controls -->
  <ChalkboardEffects />
</html>
```

The default background is plain ink. An optional named slot can supply your own image or background element:

```astro
<ChalkboardEffects>
  <img slot="background" src="/your-board.webp" alt="" />
</ChalkboardEffects>
```

The background fills the original 1672:941 composition area and uses `object-fit: cover`. Provide meaningful image alt text if your background communicates information; all calculation effects are decorative and hidden from assistive technology. No professor artwork, font files or private assets are included.

Define the CSS tokens used by the components. The demo matches the website's palette and uses system font fallbacks, so it downloads no fonts:

```css
:root {
  --ink: #0a1114;
  --cream: #f3efcb;
  --blue: #2d83aa;
  --mono: 'IBM Plex Mono', monospace;
}
```

The serif equations use Georgia and Times New Roman. An installed IBM Plex Mono will be used when available; otherwise the browser supplies its monospace font.

## Components

| Component | Effect |
| --- | --- |
| `WireGlobe` | Latitude and meridian rings around a tilted rotating axis |
| `WireCube` | Six CSS faces rotating in 3D |
| `WireVector` | SVG axes and vector with a CSS rotation |
| `WirePyramid` | Six calculated edges of a rotating tetrahedron |
| `RollingEquation` | Four independently staggered, stepped digit strips |
| `ChalkboardEffects` | Seven occasional wire shapes and four projected equations |

The five primitives are byte-identical exports. Size them through a containing element and set `color` to choose their stroke color. Globe, cube and pyramid accept inherited `--shape-duration` and `--shape-direction` custom properties; globe also accepts `--globe-tilt` and `--globe-roll`.

The composition preserves the 84-second principal appearance/equation cycle and 42-second smaller-shape cycle. Smaller globe, cube and pyramid rotate in reverse, using different durations. The rolling equation uses fixed shuffled digit sequences with periods of 13.7, 19.3, 23.9 and 17.1 seconds and negative offsets. This is deterministic animation, not random-number generation, live computation or a mathematical claim. Effects appear briefly and can leave the board mostly empty between appearances.

## Motion and accessibility

The demo starts with `data-motion="static"` on `<html>`. Without JavaScript it shows four static wire shapes, hides intermittent equations and smaller shapes, and keeps the unavailable motion button hidden. JavaScript progressively enables motion and reveals a native keyboard-accessible pause/resume button with a live status message.

`src/scripts/motion.js` updates the document's `data-motion` state: `running`, `paused`, or `static`. `src/styles/motion.css` freezes **every nested CSS animation**, including mesh rotations, appearances, equation projections, rolling digit strips and pseudo-elements, when the state is not `running`. Pause retains the current animation position; resume continues from it.

Include that stylesheet and the controller when reusing the composition with motion. Follow `src/pages/index.astro` for the complete controls and initialization example. To keep your integration static, leave `data-motion="static"` and omit the controller. If using a primitive independently, supply an equivalent global pause rule around it; the included motion stylesheet scopes its rules to the composition.

The CSS and controller both respect `prefers-reduced-motion: reduce`. The demo displays the static composition and disables motion activation while that preference is active. Preference changes are handled live; a manual pause remains in effect after a reduced-motion preference is enabled and then disabled.

## Provenance and verification

`source-manifest.json` records SHA-256 digests and the source website commit `9585323e54c87d92fbcbb34acf12c26bdbbe317f` from [BadBobAstro](https://github.com/silvergrund/BadBobAstro). Five primitives preserve original file bytes. `ChalkboardEffects` derives from `ProfessorScene`: it replaces the image and alt prop with a named slot, renames the wrapper, and supplies the original aspect ratio; effect markup, calculations, styles and timing remain intact.

`npm test` validates exported file hashes, rejects a deliberately modified component, and checks motion state transitions, preference changes and nested pause coverage. To additionally compare the source checkout directly:

```sh
SOURCE_ROOT=/path/to/BadBobAstro npm test
```

Source-checkout comparison includes the original composition's calculation data, effect layer, effect styles and original source hash. CI runs tests, Astro's type check and the static build. Browser visual inspection remains useful for CSS 3D rendering and timing; source and unit tests do not establish cross-browser visual acceptance.

This repository is limited to reusable decorative effects and a minimal static demo. It includes no analytics, camera access, detection models or model download, backend service, commercial website content or deployment configuration.

MIT licensed; see [LICENSE](LICENSE).
