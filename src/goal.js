import { animations } from "./assets.js";
import { Animation } from "./animation.js";

export class Goal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.solid = true;

        this.sprite = new Animation(animations.goal);
    }

    update(delta) {
        this.sprite.update(delta);
    }

    render() {
        this.sprite.draw(this.x, this.y);
    }
}
