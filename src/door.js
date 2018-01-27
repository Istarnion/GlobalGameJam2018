import { animations } from "./assets.js";
import { Animation } from "./animation.js";

export class Door {
    constructor(x, y, isHorizontal) {
        this.x = x;
        this.y = y;
        this.solid = true;
        this.isOpen = false;

        const animName = isHorizontal ? "horizontalDoor" : "verticalDoor";
        this.openAnim = new Animation(animations[`${animName}Open`]);
        this.closeAnim = new Animation(animations[`${animName}Close`]);
        this.sprite = this.closeAnim;
    }

    set open(o) {
        this.isOpen = o;
        this.solid = !o;
        this.sprite = o ? this.openAnim : this.closeAnim;
        this.sprite.reset();
    }

    get open() {
        return this.isOpen;
    }

    update(delta) {
        this.sprite.update(delta);
    }

    render() {
        this.sprite.draw(this.x, this.y);
    }
}

