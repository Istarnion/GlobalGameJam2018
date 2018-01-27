import { gfx } from "./graphics.js";

// NOTE(istarnion): These values must match the indices in the tiles array.
// This is bad, but I'm too sleepy to figure out a cleaner solution
export const tileIDs = {
    floor: 0,
    wall: 1
};

export const tiles = [
    {
        id: tileIDs.floor,
        solid: false
    },
    {
        id: tileIDs.wall,
        solid: true
    }
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
        case 0xFFFFFF: return tileIDs.floor;
        case 0x0026FF: return tileIDs.wall;
        defualt:
            console.warning(`We don't support color 0x${hex.toString(16).toUpperCase()} (yet?)`);
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

export const renderTile = (tileData, x, y) => {
    // NOTE(istarnion): This is temp code until we get a tile set!
    switch(tileData.id) {
        case tileIDs.floor:
            gfx.fillStyle = "#2D2D2D";
            break;
        case tileIDs.wall:
            gfx.fillStyle = "#D2D2D2";
            break;
        default:
            gfx.fillStyle = "black";
            break;
    }

    gfx.fillRect(48+x*32, 12+y*32, 32, 32);

    // For debug:
    //gfx.strokeStyle = "red";
    //gfx.strokeRect(48+x*32, 12+y*32, 32, 32);
}

