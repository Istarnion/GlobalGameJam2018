import { getBitmap } from "./graphics.js";
import { colorToTileID, createTile, renderTile } from "./tiles.js";
import { maps } from "./maps.js";

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

        for(let y = 0; y<this.height; ++y) {
            for(let x=0; x<this.width; ++x) {
                renderTile(this.level[y][x], x, y);
                // TODO(istarnion): Render wires!
            }
        }

        for(const objects of this.objects) {
            // TODO(istarnion): Render objects
        }

        // TODO(istarnion): Render objects ( ? Or are robots objects? )
    }

    loadCurrentLevel() {
        const levelName = `level${this.currentLevel}`;
        return this.loadLevel(levelName);
    }

    loadLevel(name) {
        const tiles = getBitmap(`${name}_tiles`);
        const map = [];

        for(let y = 0; y<tiles.height; ++y) {
            map.push([]);
            for(let x=0; x<tiles.width; ++x) {
                const tileID = colorToTileID(tiles.getPixel(x, y));
                map[y].push(createTile(tileID));
            }
        }

        return map;
    }
}

