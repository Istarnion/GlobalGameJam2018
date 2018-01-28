import { sprites, gfx } from "./graphics.js";
import { input } from "./input.js";
import { startGame, startCredits } from "./app.js";

export class MainMenu {
    constructor() {
        this.playSelected = true;
    }

    updateAndRender(delta) {
        if(input.isKeyJustPressed("up") || input.isKeyJustPressed("down")) {
            this.playSelected = !this.playSelected;
        }
        else if(input.isKeyJustPressed("e")) {
            if(this.playSelected) {
                startGame();
            }
            else {
                startCredits();
            }
        }

        gfx.drawImage(sprites["menuBG"], 0, 0);

        gfx.drawImage(
            sprites["playButton"],
            (this.playSelected ? 256 : 0), 0, 256, 128,
            136, 133, 256, 128);

        gfx.drawImage(
            sprites["creditsButton"],
            (this.playSelected ? 0 : 256), 0, 256, 128,
            136, 339, 256, 128);
    }
}

