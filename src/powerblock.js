import { animations } from "./assets.js";
import { Animation } from "./animation.js";

export class Powerblock {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.solid = true;
        this.wires = [];
        this.doors = [];
        this.isPowered = false;

        this.sprite = new Animation(animations.powerBlock);
    }

    set powered(p) {
        this.isPowered = p;

        this.sprite.currentFrame = p ? 1 : 0;

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
        this.sprite.draw(this.x, this.y);
    }

    initWires() {
        let o = 0;
        for(const wire of this.wires) {
            o = 0;
            for(const otherWire of this.wires) {
                if(wire !== otherWire) {
                    if(wire.y - otherWire.y === 1 && wire.x === otherWire.x) {
                        // above
                        o |= 1;
                    }
                    else if(wire.x - otherWire.x === 1 && wire.y === otherWire.y) {
                        // Left
                        o |= 2;
                    }
                    if(wire.y - otherWire.y === -1 && wire.x === otherWire.x) {
                        // Below
                        o |= 4;
                    }
                    else if(wire.x - otherWire.x === -1 && wire.y === otherWire.y) {
                        // Right
                        o |= 8;
                    }
                }
            }

            for(const door of this.doors) {
                if(wire.y - door.y === 1 && wire.x === door.x) {
                    // above
                    o |= 1;
                }
                else if(wire.x - door.x === 1 && wire.y === door.y) {
                    // Left
                    o |= 2;
                }
                if(wire.y - door.y === -1 && wire.x === door.x) {
                    // Below
                    o |= 4;
                }
                else if(wire.x - door.x === -1 && wire.y === door.y) {
                    // Right
                    o |= 8;
                }
            }

            if(wire.y - this.y === 1 && wire.x === this.x) {
                // above
                o |= 1;
            }
            else if(wire.x - this.x === 1 && wire.y === this.y) {
                // Left
                o |= 2;
            }
            if(wire.y - this.y === -1 && wire.x === this.x) {
                // Below
                o |= 4;
            }
            else if(wire.x - this.x === -1 && wire.y === this.y) {
                // Right
                o |= 8;
            }

            if(o === 5) wire.orientation = "v";
            else if(o === 10) wire.orientation = "h";
            else if(o === 12) wire.orientation = "se";
            else if(o === 6) wire.orientation = "sw";
            else if(o === 9) wire.orientation = "ne";
            else if(o === 3) wire.orientation = "nw";
        }
    }
}

