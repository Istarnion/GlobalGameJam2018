import { getBitmap } from "./graphics.js";

import { tileIDs, colorToTileID, createTile, renderTile } from "./tiles.js";
import { maps } from "./maps.js";

import { Powerblock } from "./powerblock.js";
import { Wire } from "./wire.js";
import { Door } from "./door.js";

export class Game {
    constructor() {
        this.currentLevel = 0;
        this.level = {};
        this.width = 22;
        this.height = 18;

        this.objects = [];
    }

    init() {
        this.level = this.loadCurrentLevel();
    }

    updateAndRender(delta) {
        // TODO(istarnion): Update game logic
        // If level complete, fade out. If no more levels, go to victory screen, else load next level

        // Render tiles:
        for(let y = 0; y<this.height; ++y) {
            for(let x=0; x<this.width; ++x) {
                const tile = this.getTileAt(x, y);
                if(tile.hasOwnProperty("render")) {
                    tile.render(x, y);
                }
                // TODO(istarnion): Render wires!
            }
        }

        for(const obj of this.objects) {
            obj.render();
        }

        // TODO(istarnion): Render objects ( ? Or are robots objects? )
    }

    getTileAt(x, y) {
        return this.level[y][x];
    }

    loadCurrentLevel() {
        const levelName = `level${this.currentLevel}`;
        return this.loadLevel(levelName);
    }

    loadLevel(name) {
        const tiles = getBitmap(`${name}_tiles`);
        const wires = getBitmap(`${name}_wire`);
        //const decor = getBitmap(`${name}_decor`);
        const map = [];

        for(let y = 0; y<tiles.height; ++y) {
            map.push([]);
            for(let x=0; x<tiles.width; ++x) {
                const tileID = colorToTileID(tiles.getPixel(x, y));
                map[y].push(createTile(tileID));
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

