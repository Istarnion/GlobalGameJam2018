import { gfx, setGameSize, clear, loadImages } from "./graphics.js";
import { images, animations } from "./assets.js";
import { Animation } from "./animation.js";

setGameSize(640, 480);

gfx.fillText("Loading...", gfx.width / 2, gfx.height / 2);

let w1 = null;
let w2 = null;
let w3 = null;
let w4 = null;

let prevTime = performance.now();

const init = () => {
    w1 = new Animation(animations.water1);
    w2 = new Animation(animations.water2);
    w3 = new Animation(animations.water3);
    w4 = new Animation(animations.water4);
}

const update = () => {
    clear();
    const now = performance.now();
    const deltaTime = (now - prevTime) / 1000.0;
    prevTime = now;

    w1.update(deltaTime);
    w2.update(deltaTime);
    w3.update(deltaTime);
    w4.update(deltaTime);

    w1.draw(gfx.width / 2 - 64, gfx.height / 2 - 16);
    w2.draw(gfx.width / 2 - 32, gfx.height / 2 - 16);
    w3.draw(gfx.width / 2 + 0, gfx.height / 2 - 16);
    w4.draw(gfx.width / 2 + 32, gfx.height / 2 - 16);

    window.requestAnimationFrame(update);
}

const imagesToLoad = [];
for(const img in images) {
    if(images.hasOwnProperty(img)) {
        imagesToLoad.push([ img, images[img] ]);
    }
}

loadImages(imagesToLoad).then(() => {
    init();
    update(); // This starts the update loop
});

