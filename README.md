# BadBob Vector Lab

Small spinning wireframes and animated equations for the web. Includes a globe, cube, pyramid, vector and rolling numbers.

## Run the demo

Install [Node.js](https://nodejs.org/) 22.19 or newer, then:

```sh
git clone https://github.com/silvergrund/badbob-vector-lab.git
cd badbob-vector-lab
npm ci
npm run dev
```

Open the local address printed in your terminal. Use **Pause motion** to stop the animations. Reduced-motion preferences are respected automatically.

npm installs the dependencies automatically.

## Make it yours

Edit [src/pages/index.astro](src/pages/index.astro) to change the demo. The reusable effects are in [src/components](src/components/); the page shows how to combine them with motion controls. You can supply your own background image.

The effects use HTML, SVG and CSS. They work without a canvas. Without JavaScript, the demo shows a static illustration.

## Test and build

```sh
npm test
npm run check
npm run build
npm run preview
```

The finished website is in `dist/`. `npm run preview` lets you check it locally before hosting it.

Contributions are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE). No artwork or models are included.
