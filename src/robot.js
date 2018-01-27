import { gfx } from "./graphics.js";
import { Directions } from "./utils.js";

export const RobotTypes = {
    power: 0,
    magnet: 1,
    mirror: 2
};

export class Robot {
    constructor(type) {
        this.type = type;
        this.x = 0;
        this.y = 0;

        this.dir = Directions.up;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    render() {
        gfx.fillStyle = "#0000FF";
        gfx.fillRect(48+this.x*32+2, 12+this.y*32+2, 28, 28);
    }

    update(deltaTime) {
        // Update anim
    }
}

