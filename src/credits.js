import { sprites, gfx } from "./graphics.js";
import { input } from "./input.js";
import { startMenu } from "./app.js";

export class Credits {
    constructor() {
    }

    updateAndRender(delta) {
        if(input.isKeyJustPressed("e")) {
            startMenu();
        }

        gfx.drawImage(sprites["creditsBG"], 0, 0);


        gfx.drawImage(
            sprites["backButton"],
            256, 0, 256, 128,
            405, 394, 256, 128);
    }
}

