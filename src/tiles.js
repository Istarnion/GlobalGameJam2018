import { gfx, sprites, drawSprite } from "./graphics.js";
// NOTE(istarnion): These values must match the indices in the tiles array.
// This is bad, but I'm too sleepy to figure out a cleaner solution
export const tileIDs = {
    floor: 0,
    wall: 1,
    chasm: 2,
    emitter: 3,
    powerblock: 10,
    wire: 11,
    door: 12,
};

export const tiles = [
    {
        id: tileIDs.floor,
        solid: false,
        sprite: "floor1",

        render: function(x, y) {
            renderTile(sprites[this.sprite], x, y);
        }
    },
    {
        id: tileIDs.wall,
        solid: true,
        sprite: "wall1",

        render: function(x, y) {
            renderTile(sprites[this.sprite], x, y);
        }
    },
    {
        id: tileIDs.chasm,
        solid: true,
        sprite: "chasm",

        render: function(x, y) {
            renderTile(sprites[this.sprite], x, y);
        }
    },
];

export const colorToTileID = (color) => {
    /*
        FFFFFF = Floor
        0026FF = Wall
        000000 = Chasm
        404040 = Nothingness
        7F0000 = Block
        FFD800 = EmitterUp
        FF6A00 = MemoryUp
        00FF21 = Goal
        FF0000 = RobotRelay
        00FFFF = RobotPower
        B200FF = RobotMagnet
        57007F = MirrorSW
        7F6A00 = MirrorSE
        267F00 = Door
        808080 = Power
        FF7F7F = Cable
    */
    const hex = (
        (color.r << 16) |
        (color.g << 8)  |
        (color.b << 0));

    switch(hex) {
        // Robots have floors under them! Blocks too!
        case 0xFF0000:
        case 0x00FFFF:
        case 0xB200FF:
        case 0x7F0000:
        case 0x57007F:
        case 0x7F6A00:
        case 0xFFD800:
        case 0x00FF21:
        case 0xFFFFFF: return tileIDs.floor;

        case 0x0026FF: return tileIDs.wall;

        case 0x808080: return tileIDs.powerblock;
        case 0xFF7F7F: return tileIDs.wire;
        case 0x267F00: return tileIDs.door;

        case 0x000000: return tileIDs.chasm;


        defualt:
            console.warn(`We don't support color 0x${hex.toString(16).toUpperCase()} (yet?)`);
            break;
    }
};

export const createTile = (tile) => {
    const result = {};
    const tileData = tiles[tile];

    for(const prop in tileData) {
        if(tileData.hasOwnProperty(prop)) {
            result[prop] = tileData[prop];
        }
    }

    return result;
};

export const renderTile = (colorOrImage, x, y) => {
    drawSprite(colorOrImage, x, y);

    // For debug:
    //gfx.strokeStyle = "red";
    //gfx.strokeRect(48+x*32, 12+y*32, 32, 32);
}

