import { animations } from "./assets.js";
import { Animation } from "./animation.js";
import { Directions } from "./utils.js";

export class LaserBeam {
    constructor(x, y, dir, ext) {
        this.x = x;
        this.y = y;

        if(ext.length > 0) {
            this.direction = Directions.up;
        }
        else {
            this.direction = dir;
        }

        this.sprite = new Animation(animations[`laser${ext}`]);
    }

    update(delta) {
        this.sprite.update(delta);
    }

    render() {
        this.sprite.draw(this.x, this.y, 0, 0, this.direction);
    }
}

