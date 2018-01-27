import { gfx, setGameSize, clear, loadImages } from "./graphics.js";
import { images } from "./assets.js";
import { input } from "./input.js";
import { Game } from "./game.js";
import { maps } from "./maps.js";

setGameSize(800, 600);

gfx.fillText("Loading...", gfx.width / 2, gfx.height / 2);

let prevTime = performance.now();

let game = null;

const init = () => {
    game = new Game();
    game.init();
}

const update = () => {
    clear();
    const now = performance.now();
    const deltaTime = (now - prevTime) / 1000.0;
    prevTime = now;

    input.update();

    game.updateAndRender(deltaTime);

    window.requestAnimationFrame(update);

    input.lateUpdate();
}

const imagesToLoad = [];
for(const img in images) {
    if(images.hasOwnProperty(img)) {
        imagesToLoad.push([ img, images[img] ]);
    }
}

for(let i=0; i<maps.length; ++i) {
    const name = `level${i}_`;
    imagesToLoad.push([ name+"tiles", maps[i].tiles ]);

    if(maps[i].hasOwnProperty("wire")) {
        imagesToLoad.push([ name+"wire", maps[i].wire ]);
    }

    if(maps[i].hasOwnProperty("decor")) {
        imagesToLoad.push([ name+"decor", maps[i].decor ]);
    }
}

loadImages(imagesToLoad).then(() => {
    init();
    update(); // This starts the update loop
});

