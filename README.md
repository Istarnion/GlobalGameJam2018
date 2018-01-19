# Global Game Jam 2018

## Setup
You need npm and an up-to-date modern browser.

```
git pull https://github.com/Istarnion/GlobalGameJam2018.git
cd GlobalGameJam2018
npm install
```

## Developing
We use webpack both for bundling and as dev server, so place source files in `src/` and just use `ìnclude`-statements. No need to modify index.html ever.

Webpack watches your files, and re-bundles and refreshes the page whenever you save.
To start Webpack, run
```
npm start
```

## Notes
You can get the normal canvas 2D context by `import gfx from "./graphics.js"`. In addition to the standard functions, I have added `drawLine(x0, y0, x1, y1)`. 

