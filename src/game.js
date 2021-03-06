import { startCredits } from "./app.js";
import { gfx, sprites, getBitmap } from "./graphics.js";
import { musicManager } from "./musicManager.js";
import { input } from "./input.js";
import { tileIDs, colorToTileID, createTile, renderTile } from "./tiles.js";
import { maps } from "./maps.js";
import { Powerblock } from "./powerblock.js";
import { Wire } from "./wire.js";
import { Door } from "./door.js";
import { Block } from "./block.js";
import { Goal } from "./goal.js";
import { Emitter } from "./emitter.js";
import { LaserBeam } from "./laserbeam.js";
import { Mirror } from "./mirror.js";

import { RobotTypes, Robot } from "./robot.js";
import { Directions, removeFromArray } from "./utils.js";
import { Cursor } from "./cursor.js";

export class Game {
    constructor() { this.currentLevel = 0; this.level = {};
        this.width = 22;
        this.height = 18;

        this.objects = [];
        this.emitter = null;
        this.goal = null;
        this.decor = [];

        this.powerBot = new Robot(RobotTypes.power);
        this.magnetBot = new Robot(RobotTypes.magnet);
        this.mirrorBot = new Robot(RobotTypes.mirror);

        this.activeBot = this.powerBot;
        this.activeBot.active = true;

        this.state = "fadingIn";
        this.fadeLevel = 1.0;

        this.cursor = null;
        this.levelComplete = false;
    }

    init() {
        this.level = this.loadCurrentLevel();
        this.updateEmitterLaser();
        this.cursor = new Cursor(this.activeBot.x, this.activeBot.y);
    }

    updateAndRender(delta) {
        if(this.state === "normal") {
            // Check for input, game logic
            if(input.isKeyDown("one")) {
                if(this.activeBot !== this.powerBot) {
                    this.activeBot.active = false;
                    this.activeBot = this.powerBot;
                    this.activeBot.active = true;
                }
            }
            else if(input.isKeyDown("two")) {
                if(this.activeBot !== this.magnetBot) {
                    this.activeBot.active = false;
                    this.activeBot = this.magnetBot;
                    this.activeBot.active = true;
                }
            }
            else if(input.isKeyDown("three")) {
                if(this.activeBot !== this.mirrorBot) {
                    this.activeBot.active = false;
                    this.activeBot = this.mirrorBot;
                    this.activeBot.active = true;
                }
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

                if(!this.canRobotWalkTo(targetX, targetY)) {
                    // U cannot go here!
                    targetX = this.activeBot.x;
                    targetY = this.activeBot.y;
                }

                if(move !== this.activeBot.dir || targetX !== this.activeBot.x || targetY !== this.activeBot.y) {


                    this.activeBot.move(move, targetX, targetY);
                    if(this.activeBot === this.powerBot) {
                        this.updatePowerBotActivation(false);
                    }

                    this.updateEmitterLaser();
                }
            }
            else {
                if(input.isKeyJustPressed("e")) {
                    if(this.activeBot === this.powerBot) {
                        this.updatePowerBotActivation(true);
                        this.updateEmitterLaser();
                    }
                    else if(this.activeBot === this.magnetBot) {
                        this.magnetBotPushPull(true);
                        this.updateEmitterLaser();
                    }
                }
                else if(input.isKeyJustPressed("q")) {
                    if(this.activeBot === this.magnetBot) {
                        this.magnetBotPushPull(false);
                        this.updateEmitterLaser();
                    }
                }
            }

            this.cursor.setTarget(this.activeBot.x, this.activeBot.y);
        }
        else if(this.state === "fadingIn") {
            this.fadeLevel = Math.max(0, this.fadeLevel - delta);
            if(this.fadeLevel === 0) {
                this.state = "normal";
            }
        }
        else if(this.state === "fadingOut") {
            this.fadeLevel = Math.min(1, this.fadeLevel + delta);
            if(this.fadeLevel === 1) {
                this.currentLevel++;
                if(this.currentLevel >= maps.length) {
                    startCredits();
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

        for(const obj of this.objects) {
            if(obj.update) {
                obj.update(delta);
            }
        }

        if(this.state === "normal" && this.levelComplete) {
            this.state = "fadingOut";
        }

        // Render tiles:
        for(let y = 0; y<this.height; ++y) {
            for(let x=0; x<this.width; ++x) {
                const tile = this.getTileAt(x, y);
                if(tile.hasOwnProperty("render")) {
                    tile.render(x, y);
                }
            }
        }

        for(const d of this.decor) {
            gfx.drawImage(sprites[d.image], d.x, d.y);
        }

        for(const obj of this.objects) {
            if(!!obj.earlyRender) {
                obj.earlyRender();
            }
        }

        for(const obj of this.objects) {
            if(!!obj.render) {
                obj.render();
            }
        }

        this.powerBot.render();
        this.magnetBot.render();
        this.mirrorBot.render();

        this.cursor.update(delta);
        this.cursor.render();

        gfx.fillStyle = `rgba(0, 0, 0, ${this.fadeLevel})`;
        gfx.fillRect(0, 0, gfx.width, gfx.height);
    }

    getTileAt(x, y) {
        return this.level[y][x];
    }

    canRobotWalkTo(x, y) {
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
                    if(x === r.x && y === r.y) {
                        blocked = true;
                        break;
                    }
                }
            }
        }

        return !blocked;
    }

    updateEmitterLaser() {
        this.emitter.laserBeams.length = 0;
        const currCoord = { x: this.emitter.x, y: this.emitter.y };
        let currDir = this.emitter.direction;
        while(true) {
            switch(currDir) {
                case Directions.up:    --currCoord.y; break;
                case Directions.right: ++currCoord.x; break;
                case Directions.down:  ++currCoord.y; break;
                case Directions.left:  --currCoord.x; break;
                default: break;
            }

            let ext = "";
            let blocked = false;
            const targetTile = this.getTileAt(currCoord.x, currCoord.y);
            if(!!targetTile && targetTile.solid && targetTile.id !== tileIDs.chasm) {
                blocked = true;
            }
            else {
                for(const obj of this.objects) {
                    if(obj.x === currCoord.x && obj.y === currCoord.y && !!obj.solid) {
                        if(obj instanceof Goal) {
                            this.levelComplete = true;
                            blocked = true;
                        }
                        else if(obj instanceof Mirror) {
                            if(currDir === Directions.up) {
                                if(obj.orientation === "sw") {
                                    ext = "_sw";
                                    currDir = Directions.left;
                                }
                                else if(obj.orientation === "se") {
                                    ext = "_se";
                                    currDir = Directions.right;
                                }
                                else {
                                    blocked = true;
                                }
                            }
                            else if(currDir === Directions.right) {
                                if(obj.orientation === "sw") {
                                    ext = "_sw";
                                    currDir = Directions.down;
                                }
                                else if(obj.orientation === "nw") {
                                    ext = "_nw";
                                    currDir = Directions.up;
                                }
                                else {
                                    blocked = true;
                                }
                            }
                            else if(currDir === Directions.down) {
                                if(obj.orientation === "nw") {
                                    ext = "_nw";
                                    currDir = Directions.left;
                                }
                                else if(obj.orientation === "ne") {
                                    ext = "_ne";
                                    currDir = Directions.right;
                                }
                                else {
                                    blocked = true;
                                }
                            }
                            else if(currDir === Directions.left) {
                                if(obj.orientation === "ne") {
                                    ext = "_ne";
                                    currDir = Directions.up;
                                }
                                else if(obj.orientation === "se") {
                                    ext = "_se";
                                    currDir = Directions.down;
                                }
                                else {
                                    blocked = true;
                                }
                            }
                        }
                        else if(obj instanceof Door) {
                            if(!obj.open) {
                                blocked = true;
                            }
                        }
                        else {
                            blocked = true;
                        }
                        break;
                    }
                }

                if(!blocked) {
                    for(const r of [this.magnetBot, this.powerBot, this.mirrorBot]) {
                        if(currCoord.x === r.x && currCoord.y === r.y) {
                            if(r === this.mirrorBot) {
                                if(currDir === Directions.up) {
                                    if(r.dir === Directions.down) {
                                        ext = "_sw";
                                        currDir = Directions.left;
                                    }
                                    else if(r.dir === Directions.right) {
                                        ext = "_se";
                                        currDir = Directions.right;
                                    }
                                    else {
                                        blocked = true;
                                    }
                                }
                                else if(currDir === Directions.right) {
                                    if(r.dir === Directions.down) {
                                        ext = "_sw";
                                        currDir = Directions.down;
                                    }
                                    else if(r.dir === Directions.left) {
                                        ext = "_nw";
                                        currDir = Directions.up;
                                    }
                                    else {
                                        blocked = true;
                                    }
                                }
                                else if(currDir === Directions.down) {
                                    if(r.dir === Directions.left) {
                                        ext = "_nw";
                                        currDir = Directions.left;
                                    }
                                    else if(r.dir === Directions.up) {
                                        ext = "_ne";
                                        currDir = Directions.right;
                                    }
                                    else {
                                        blocked = true;
                                    }
                                }
                                else if(currDir === Directions.left) {
                                    if(r.dir === Directions.up) {
                                        ext = "_ne";
                                        currDir = Directions.up;
                                    }
                                    else if(r.dir === Directions.right) {
                                        ext = "_se";
                                        currDir = Directions.down;
                                    }
                                    else {
                                        blocked = true;
                                    }
                                }
                            }
                            else {
                                blocked = true;
                            }
                            break;
                        }
                    }
                }
            }

            if(blocked) break;
            else this.emitter.laserBeams.push(new LaserBeam(currCoord.x, currCoord.y, currDir, ext));
        }
    }

    updatePowerBotActivation(isOn) {
        let targetX = this.activeBot.x;
        let targetY = this.activeBot.y;
        if(this.activeBot.dir === Directions.up) --targetY;
        else if(this.activeBot.dir === Directions.right) ++targetX;
        else if(this.activeBot.dir === Directions.down) ++targetY;
        else if(this.activeBot.dir === Directions.left) --targetX;

        for(const obj of this.objects) {
            if(!!obj.setPowerState) {
                if(obj.x === targetX && obj.y === targetY) {
                    obj.setPowerState(isOn);
                }
                else {
                    obj.setPowerState(false);
                }
            }
        }
    }

    magnetBotPushPull(push) {
        let dx = 0;
        let dy = 0;
        switch(this.magnetBot.dir) {
            case Directions.up: --dy; break;
            case Directions.right: ++dx; break;
            case Directions.down: ++dy; break;
            case Directions.left: --dx; break;
        }

        const currCoord = { x: this.magnetBot.x, y: this.magnetBot.y };
        while(true) {
            currCoord.x += dx;
            currCoord.y += dy;

            if(currCoord.x < 0 || currCoord.x >= 22) return;
            if(currCoord.y < 0 || currCoord.y >= 18) return;

            const targetTile = this.getTileAt(currCoord.x, currCoord.y);
            if(!!targetTile && targetTile.solid && !(targetTile.id === tileIDs.chasm)) {
                // Can't move solid tiles
                return;
            }

            for(const obj of this.objects) {
                if(obj.x === currCoord.x && obj.y === currCoord.y) {
                    if(
                        (obj instanceof Block) ||
                        (obj instanceof Mirror)) {

                        const targetX = currCoord.x + dx * (push ? 1 : -1);
                        const targetY = currCoord.y + dy * (push ? 1 : -1);

                        if(this.canRobotWalkTo(targetX, targetY)) {
                            obj.x = targetX;
                            obj.y = targetY;
                            musicManager.playSound("blockDrag");
                        }
                        else if((obj instanceof Block) && this.getTileAt(targetX, targetY).id === tileIDs.chasm) {
                            this.level[targetY][targetX] = createTile(tileIDs.fallenBlock);
                            this.level[targetY][targetX].sprite = obj.sprite;
                            removeFromArray(this.objects, obj);
                            musicManager.playSound("blockFall");
                        }

                        return;
                    }
                    else {
                        if(!(
                            (obj instanceof Wire) ||
                            (obj instanceof Door && obj.open))) {
                            return;
                        }
                    }
                }
            }
        }
    }

    loadCurrentLevel() {
        const levelName = `level${this.currentLevel}`;
        this.levelComplete = false;
        this.decor = maps[this.currentLevel].decor;
        return this.loadLevel(levelName);
    }

    loadLevel(name) {
        const tiles = getBitmap(`${name}_tiles`);
        const wires = getBitmap(`${name}_wire`);
        const map = [];
        this.objects.length = 0;

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
                        case 0xFFD800:
                            this.emitter = new Emitter(x, y, Directions.up);
                            this.objects.push(this.emitter);
                            break;
                        case 0xDE00FF:
                            this.emitter = new Emitter(x, y, Directions.down);
                            this.objects.push(this.emitter);
                            break;
                        case 0xFF6A00:
                            // Memory (up)
                            break;
                        case 0x57007F:
                            this.objects.push(new Mirror(x, y, "sw"));
                            break;
                        case 0x7F6A00:
                            this.objects.push(new Mirror(x, y, "se"));
                            break;
                        case 0x00FF21:
                            // Goal
                            this.goal = new Goal(x, y);
                            this.objects.push(this.goal);
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
                            let isHorizontal = false;
                            const tileAbove = map[_y-1][_x];
                            if(!!tileAbove && tileAbove.id === tileIDs.wall) isHorizontal = true;
                            const door = new Door(_x, _y, isHorizontal);
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

                    powerblock.initWires();
                }
            }
        }

        return map;
    }
}

