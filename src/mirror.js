import { sprites, drawSprite  } from "./graphics.js";

export class Mirror {
    constructor(x, y, orientation) {
        this.x = x;
        this.y = y;
        this.solid = true;
        this.isMirror = true;

        this.sprite = sprites[`mirror_${orientation}`];
    }

    render() {
        drawSprite(this.sprite, this.x, this.y);
    }
}

