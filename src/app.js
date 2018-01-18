import { gfx, setGameSize, clear, loadImages } from "./graphics.js";

setGameSize(640, 480);

// TODO: Draw loading scree

const update = () => {
    clear();

    gfx.fillStyle = "#2d2d2d";
    gfx.fillRect(0, 0, gfx.width, gfx.height);

    gfx.fillStyle = "white";
    gfx.fillRect(gfx.width / 2 - 32, gfx.height / 2 - 32, 64, 64);
    gfx.fillRect(0, 0, 64, 64);

    window.requestAnimationFrame(update);
}

loadImages([
    // TODO(istarnion): Add _all_ images here to preload them
]).then(() => {
    // When done loading images, start the main loop
    update();
});

