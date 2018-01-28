import { gfx, setGameSize, clear, loadImages } from "./graphics.js";
import { images } from "./assets.js";
import { input } from "./input.js";
import { Game } from "./game.js";
import { MainMenu } from "./menu.js";
import { Credits } from "./credits.js";
import { maps } from "./maps.js";
import { musicManager } from "./musicManager";

setGameSize(800, 600);

gfx.fillText("Loading...", gfx.width / 2, gfx.height / 2);

let prevTime = performance.now();

let game = null;
let mainMenu = null;
let credits = null;

export let gameState = "MainMenu";

export const startGame = () => {
    game = new Game();
    game.init();
    musicManager.beginLevel();
    gameState = "Game";
};

export const startCredits = () => {
    credits = new Credits();
    gameState = "Credits";
}

export const startMenu = () => {
    mainMenu = new MainMenu();
    gameState = "MainMenu";
}

const init = () => {
    startMenu();
}

const update = () => {
    clear();
    const now = performance.now();
    const deltaTime = (now - prevTime) / 1000.0;
    prevTime = now;

    input.update();
    musicManager.update(deltaTime);

    switch(gameState) {
        case "MainMenu":
            mainMenu.updateAndRender(deltaTime);
            break;
        case "Game":
            game.updateAndRender(deltaTime);
            break;
        case "Credits":
            credits.updateAndRender(deltaTime);
            break;
        default: break;
    }

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
}

loadImages(imagesToLoad).then(() => {
    init();
    update(); // This starts the update loop
});

