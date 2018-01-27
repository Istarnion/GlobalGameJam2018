import { gfx, drawSprite } from "./graphics.js";
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
        this.moving = false;
        this.moveTime = 0;

        this.offsetX = 0;
        this.offsetY = 0;
        this.deltaX = 0;
        this.deltaY = 0;

        this.speed = 160;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    move(direction, x, y) {
        this.moving = true;
        if(direction !== this.dir) {
            this.moveTime = 0.2;
            this.dir = direction;
        }
        else {
            if(this.x < x) {
                this.offsetX = -32;
                this.deltaX = this.speed;
            }
            else if(this.x > x) {
                this.offsetX = 32;
                this.deltaX = -this.speed;
            }
            else if(this.y < y) {
                this.offsetY = -32;
                this.deltaY = this.speed;
            }
            else if(this.y > y) {
                this.offsetY = 32;
                this.deltaY = -this.speed;
            }

            this.x = x;
            this.y = y;
        }
    }

    render() {
        drawSprite("#0000FF", this.x, this.y, this.offsetX, this.offsetY);
    }

    update(deltaTime) {
        if(this.moving) {
            this.moveTime = Math.max(0, this.moveTime - deltaTime);

            this.offsetX += this.deltaX * deltaTime;
            this.offsetY += this.deltaY * deltaTime;

            if(Math.abs(this.offsetX) < 1) this.offsetX = 0;
            if(Math.abs(this.offsetY) < 1) this.offsetY = 0;

            if(this.moveTime === 0 && this.offsetX === 0 && this.offsetY === 0) {
                this.deltaX = this.deltaY = 0;
                this.moving = false;
            }
        }
    }
}

