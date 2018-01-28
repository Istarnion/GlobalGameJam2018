import { gfx } from "./graphics.js";
import { animations } from "./assets.js";
import { Animation } from "./animation.js";

export class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.solid = true;

        this.sprite = new Animation(animations.block);
    }

    render() {
        this.sprite.draw(this.x, this.y);
    }
}

