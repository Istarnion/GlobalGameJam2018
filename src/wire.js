import { drawSprite, sprites } from "./graphics.js";

export class Wire {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.solid = false;
        this.isPowered = false;

        this.currentSprite = "#440000";
        this.sprite = null;
        this.o = "";
    }

    set orientation(o) {
        this.o = o;
        this.sprite = sprites[`wire_${o}`];
    }

    set powered(p) {
        this.isPowered = p;
        if(p) {
            this.sprite = sprites[`wire_powered_${this.o}`];
        }
        else {
            this.sprite = sprites[`wire_${this.o}`];
        }
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

