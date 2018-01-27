import { drawSprite, sprites } from "./graphics.js";

export class Wire {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.solid = false;
        this.isPowered = false;

        this.currentSprite = "#440000";
        this.sprite = null;
    }

    set orientation(o) {
        this.sprite = sprites[`wire_${o}`];
    }

    set powered(p) {
        this.isPowered = p;
    }

    get powered() {
        return this.isPowered;
    }

    render() {
        if(!!this.sprite) {
            drawSprite(this.sprite, this.x, this.y);
        }
    }
}

