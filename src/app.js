import { gfx, setGameSize, clear, loadImages } from "./graphics.js";
import { images, animations } from "./assets.js";
import { Animation } from "./animation.js";
import { input } from "./input.js";
import { Slime } from "./slime.js";

setGameSize(160, 120);

gfx.fillText("Loading...", gfx.width / 2, gfx.height / 2);

let w1 = null;
let w2 = null;
let w3 = null;
let w4 = null;

let slime = null;

let prevTime = performance.now();

const init = () => {
    w1 = new Animation(animations.water1);
    w2 = new Animation(animations.water2);
    w3 = new Animation(animations.water3);
    w4 = new Animation(animations.water4);

    slime = new Slime(gfx.width / 2 - 16, gfx.height / 2 - 16);
}

const update = () => {
    clear();
    const now = performance.now();
    const deltaTime = (now - prevTime) / 1000.0;
    prevTime = now;

    input.update();
    
    gfx.fillStyle = "#2D2D2D";
    gfx.fillRect(0, 0, gfx.width, gfx.height);
    slime.updateAndRender(deltaTime);

    w1.update(deltaTime);
    w2.update(deltaTime);
    w3.update(deltaTime);
    w4.update(deltaTime);

    w1.draw(0, gfx.height - 32);
    w2.draw(32, gfx.height - 32);
    w3.draw(64, gfx.height - 32);
    w4.draw(96, gfx.height - 32);
    w1.draw(128, gfx.height - 32);

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

