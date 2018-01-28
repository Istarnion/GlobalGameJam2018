import { animations } from "./assets.js";
import { Animation } from "./animation.js";
import { Directions } from "./utils.js";

export class Emitter {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.solid = true;

        this.sprite = new Animation(animations.emitter);

        this.laserBeams = [];

        this.direction = dir;
    }

    update(delta) {
        this.sprite.update(delta);
        for(const beam of this.laserBeams) {
            beam.update(delta);
        }
    }

    render() {
        this.sprite.draw(this.x, this.y, 0, 0, this.direction);

        for(const beam of this.laserBeams) {
            beam.render();
        }
    }
}
