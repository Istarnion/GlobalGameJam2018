import { gfx } from "./graphics.js";

export class Wire {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isPowered = false;

        this.currentSprite = "#440000";
    }

    set powered(p) {
        this.isPowered = p;

        // NOTE(istarnion): TEMP!
        this.currentSprite = p ? "#FF0000" : "#440000";
    }

    get powered() {
        return this.isPowered;
    }

    render() {
        gfx.fillStyle = this.currentSprite;
        gfx.fillRect(48+this.x*32+2, 12+this.y*32+2, 28, 28);

        // NOTE(istarnion): This is what we will use when we get wire sprites:
        // renderTile(this.currentSprite, this.x, this.y);
    }
}

