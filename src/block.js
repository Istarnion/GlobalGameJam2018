import { gfx } from "./graphics.js";

export class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.solid = true;

        this.currentSprite = "#4D4D4D";
    }

    render() {
        gfx.fillStyle = this.currentSprite;
        gfx.fillRect(48+this.x*32+2, 12+this.y*32+2, 28, 28);

        // NOTE(istarnion): This is what we will use when we get wire sprites:
        // renderTile(this.currentSprite, this.x, this.y);
    }
}

