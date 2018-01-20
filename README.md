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

## API

### Graphics
You can get the normal canvas 2D context by `import { gfx } from "./graphics.js"`. In addition to the standard functions, I have added `drawLine(x0, y0, x1, y1)` for convenience.
Documentation is [here](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

There is also an Animation class. To use it, first define your animation in assets.js. Then you can create instances of this animation by `const anim = new Animation(animations.myAnim);`. Remember to import `animations` from assets.js and `Animation` from animation.js.
In order to keep the animation animating, you must call its update-function, and pass it deltaTime.
Draw the animation using the draw-function, which takes x and y coordinates.
You can register listeners on the animation as well, to get notified when it loops. You can also listen for frame changes. See animation.js for details.

### Audio
We use Howler.js to simplify audio. Docs are [here](https://github.com/goldfire/howler.js#documentation).

### Input
There are many ways to get input. First you have to import it using `import { input } from "./input.js";`. Then you can poll the state of the keyboard by calling `input.isKeyDown(keyname)`, or the other functions in that family (isKeyJustPressed, and isKeyJustReleased).
However, you can also choose to register listeners for keypresses. Do this by passing callbacks to `input.addKeyDownListener` or `input.addKeyUpListener`. You can choose to pass a key name before the callback to listen only for a specific key. If you only pass a function, you will get called on every event.
These listeners are always called before their update functions.

