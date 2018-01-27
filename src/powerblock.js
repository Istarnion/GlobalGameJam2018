import { renderTile } from "./tiles.js";

export class Powerblock {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.wires = [];
        this.doors = [];
        this.isPowered = false;

        this.currentSprite = "#444400";
    }

    set powered(p) {
        this.isPowered = p;

        // NOTE(istarnion): TEMP!
        this.currentSprite = p ? "#AAAA00" : "#444400";

        for(const wire of this.wires) {
            wire.powered = p;
        }

        for(const door of this.doors) {
            door.open = p;
        }
    }

    get powered() {
        return this.isPowered;
    }

    render() {
        renderTile(this.currentSprite, this.x, this.y);
    }
}

