import { gfx, getBitmap } from "./graphics.js";
import { input } from "./input.js";

import { tileIDs, colorToTileID, createTile, renderTile } from "./tiles.js";
import { maps } from "./maps.js";

import { Powerblock } from "./powerblock.js";
import { Wire } from "./wire.js";
import { Door } from "./door.js";
import { Block } from "./block.js";

import { RobotTypes, Robot } from "./robot.js";
import { Directions } from "./utils.js";

export class Game {
    constructor() { this.currentLevel = 0; this.level = {};
        this.width = 22;
        this.height = 18;

        this.objects = [];

        this.powerBot = new Robot(RobotTypes.power);
        this.magnetBot = new Robot(RobotTypes.magnet);
        this.mirrorBot = new Robot(RobotTypes.mirror);

        this.activeBot = this.powerBot;

        this.state = "fadingIn";
        this.fadeLevel = 1.0;
    }

    init() {
        this.level = this.loadCurrentLevel();
    }

    updateAndRender(delta) {
        if(this.state === "normal") {
            // Check for input, game logic
            if(input.isKeyDown("one")) {
                this.activeBot = this.powerBot;
            }
            else if(input.isKeyDown("two")) {
                this.activeBot = this.magnetBot;
            }
            else if(input.isKeyDown("three")) {
                this.activeBot = this.mirrorBot;
            }

            if(input.isKeyJustPressed("space")) {
                this.objects[0].powered = !this.objects[0].powered;
            }

            let move = null;
            if(input.isKeyDown("up")) {
                move = Directions.up;
            }
            else if(input.isKeyDown("right")) {
                move = Directions.right;
            }
            else if(input.isKeyDown("left")) {
                move = Directions.left;
            }
            else if(input.isKeyDown("down")) {
                move = Directions.down;
            }

            if(move !== null) {
                this.state = "animating";

                let targetX = this.activeBot.x;
                let targetY = this.activeBot.y;
                if(move === Directions.up) targetY--;
                else if(move === Directions.right) targetX++;
                else if(move === Directions.down) targetY++;
                else if(move === Directions.left) targetX--;

                if(!this.canRobotWalkTo(this.activeBot, targetX, targetY)) {
                    // U cannot go here!
                    targetX = this.activeBot.x;
                    targetY = this.activeBot.y;
                }

                this.activeBot.move(move, targetX, targetY);
            }
        }
        else if(this.state === "fadingIn") {
            this.fadeLevel = Math.max(0, this.fadeLevel - delta);
            if(this.fadeLevel === 0) {
                this.state = "normal";
            }
        }
        else if(this.state === "fadingIn") {
            this.fadeLevel = Math.min(1, this.fadeLevel + delta);
            if(this.fadeLevel === 1) {
                this.currentLevel++;
                if(this.currentLevel >= maps.length) {
                    // Game complete
                }
                else {
                    this.level = this.loadCurrentLevel();
                    this.state = "fadingIn";
                }
            }
        }
        else {
            if(!this.activeBot.moving) this.state = "normal";
        }

        this.powerBot.update(delta);
        this.magnetBot.update(delta);
        this.mirrorBot.update(delta);

        // If level complete, fade out. If no more levels, go to victory screen, else load next level

        // Render tiles:
        for(let y = 0; y<this.height; ++y) {
            for(let x=0; x<this.width; ++x) {
                const tile = this.getTileAt(x, y);
                if(tile.hasOwnProperty("render")) {
                    tile.render(x, y);
                }
            }
        }

        for(const obj of this.objects) {
            obj.render();
        }

        this.powerBot.render();
        this.magnetBot.render();
        this.mirrorBot.render();

        gfx.fillStyle = `rgba(0, 0, 0, ${this.fadeLevel})`;
        gfx.fillRect(0, 0, gfx.width, gfx.height);
    }

    getTileAt(x, y) {
        return this.level[y][x];
    }

    canRobotWalkTo(robot, x, y) {
        let blocked = false;
        const targetTile = this.getTileAt(x, y);
        if(!!targetTile && targetTile.solid) {
            blocked = true;
        }
        else {
            for(const obj of this.objects) {
                if(obj.x === x && obj.y === y && !!obj.solid) {
                    blocked = true;
                    break;
                }
            }

            if(!blocked) {
                for(const r of [this.magnetBot, this.powerBot, this.mirrorBot]) {
                    if(r !== robot) {
                        if(x === r.x && y === r.y) {
                            blocked = true;
                            break;
                        }
                    }
                }
            }
        }

        return !blocked;
    }

    loadCurrentLevel() {
        const levelName = `level${this.currentLevel}`;
        return this.loadLevel(levelName);
    }

    loadLevel(name) {
        const tiles = getBitmap(`${name}_tiles`);
        const wires = getBitmap(`${name}_wire`);
        //const decor = getBitmap(`${name}_decor`); // NOTE(istarnion): I want, but not critical
        const map = [];

        for(let y = 0; y<tiles.height; ++y) {
            map.push([]);
            for(let x=0; x<tiles.width; ++x) {
                const color = tiles.getPixel(x, y);
                const tileID = colorToTileID(color);
                map[y].push(createTile(tileID));

                // Check for robot
                if(tileID === tileIDs.floor) {
                    const hex = (
                        (color.r << 16) |
                        (color.g << 8)  |
                        (color.b << 0));

                    if(hex === 0xFFFFFF) continue;

                    switch(hex) {
                        case 0xFF0000:
                            this.mirrorBot.setPosition(x, y);
                            break;
                        case 0x00FFFF:
                            this.powerBot.setPosition(x, y);
                            break;
                        case 0xB200FF:
                            this.magnetBot.setPosition(x, y);
                            break;
                        case 0x7F0000:
                            this.objects.push(new Block(x, y));
                            break;
                        default:
                            console.warn(hex.toString(16));
                            console.warn("Bug in level loading robot logic");
                            break;
                    }
                }
            }
        }

        // NOTE(istarnion): I'm sorry for this code. :(
        // I wont be able to read it myself tomorrow, but it seems to
        // work for now
        for(let y = 0; y<wires.height; ++y) {
            for(let x=0; x<wires.width; ++x) {
                const tileID = colorToTileID(wires.getPixel(x, y));
                if(tileID === tileIDs.powerblock) {
                    const powerblock = new Powerblock(x, y);
                    this.objects.push(powerblock);

                    const openList = [];
                    const closedList = [];
                    const getNeighbour = (_x, _y) => {
                        if(closedList.indexOf(_x + _y * wires.width) >= 0) return false;

                        const color = wires.getPixel(_x, _y);
                        if(!color) return;

                        const id = colorToTileID(color);
                        if(!id) return;

                        if(id === tileIDs.wire) {
                            const wire = new Wire(_x, _y);
                            powerblock.wires.push(wire);
                            this.objects.push(wire);
                            openList.push({ x: _x, y: _y });
                        }
                        else if(id === tileIDs.door) {
                            const door = new Door(_x, _y);
                            powerblock.doors.push(door);
                            this.objects.push(door);
                            openList.push({ x: _x, y: _y });
                        }
                    };

                    const visitNeighbours = (coord) => {
                        getNeighbour(coord.x, coord.y - 1);
                        getNeighbour(coord.x - 1, coord.y);
                        getNeighbour(coord.x + 1, coord.y);
                        getNeighbour(coord.x, coord.y + 1);
                    };

                    let currCoord = { x: x, y: y };
                    openList.push(currCoord);

                    do {
                        currCoord = openList.pop();
                        closedList.push(currCoord.x + currCoord.y * wires.width);

                        visitNeighbours(currCoord);
                    }
                    while(openList.length > 0);
                }
            }
        }

        return map;
    }
}

