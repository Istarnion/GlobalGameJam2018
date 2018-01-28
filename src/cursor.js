import { sprites, drawSprite } from "./graphics.js";
import { Directions } from "./utils.js";;

export class Cursor {
    constructor(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.offsetX = 0;
        this.offsetY = 0;

        this.speed = 2048;
        this.bounceSpeed = 6;
        this.theta = 0;

        this.sprite = sprites["cursor"];
    }

    setTarget(x, y) {
        if(x !== this.targetX || y !== this.targetY) {
            this.offsetX = (this.targetX - x) * 32;
            this.offsetY = (this.targetY - y) * 32;
            this.targetX = x;
            this.targetY = y;
        }
    }

    update(delta) {
        this.theta += this.bounceSpeed * delta;
        if(this.theta > 2 * Math.PI) {
            this.theta -= 2 * Math.PI;
        }

        const dx = -this.offsetX;
        const dy = -this.offsetY;
        const len = Math.sqrt(dx*dx + dy*dy);
        if(Math.abs(len) > this.speed * delta) {
            this.offsetX += dx / len * this.speed * delta;
            this.offsetY += dy / len * this.speed * delta;
        }
        else {
            this.offsetX = this.offsetY = 0;
        }
    }

    render() {
        const radius = 16 + Math.sin(this.theta) * 4;

        drawSprite(this.sprite, this.targetX, this.targetY, this.offsetX-radius, this.offsetY-radius, Directions.up);
        drawSprite(this.sprite, this.targetX, this.targetY, this.offsetX+radius, this.offsetY-radius, Directions.right);
        drawSprite(this.sprite, this.targetX, this.targetY, this.offsetX+radius, this.offsetY+radius, Directions.down);
        drawSprite(this.sprite, this.targetX, this.targetY, this.offsetX-radius, this.offsetY+radius, Directions.left);
    }
}

