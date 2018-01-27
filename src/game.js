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

        for(const object of this.objects) {
            object.render();
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

        for(let y = 0; y<wires.height; ++y) {
            for(let x=0; x<wires.width; ++x) {
                const tileID = colorToTileID(wires.getPixel(x, y));
                if(tileID === tileIDs.powerblock) {
                    console.log(`Creating powerblock at ${x} ${y}`);
                    const powerblock = new Powerblock(x, y);
                    this.objects.push(powerblock);
                }
            }
        }

        return map;
    }
}

