import { renderTile } from "./tiles.js";

export class Door {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.solid = true;
        this.isOpen = false;

        this.currentSprite = "#D2D2D2";
    }

    set open(o) {
        this.isOpen = o;
        this.currentSprite = o ? "#2D2D2D" : "#D2D2D2";
    }

    get open() {
        return this.isPowered;
    }

    render() {
        renderTile(this.currentSprite, this.x, this.y);
    }
}

