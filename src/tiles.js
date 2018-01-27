import { gfx } from "./graphics.js";
// NOTE(istarnion): These values must match the indices in the tiles array.
// This is bad, but I'm too sleepy to figure out a cleaner solution
export const tileIDs = {
    floor: 0,
    wall: 1,
    powerblock: 2
};

export const tiles = [
    {
        id: tileIDs.floor,
        solid: false,

        render: function(x, y) {
            renderTile("#2D2D2D", x, y);
        }
    },
    {
        id: tileIDs.wall,
        solid: true,

        render: function(x, y) {
            renderTile("#D2D2D2", x, y);
        }
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
        // Robots have floors under them!
        case 0xFF0000:
        case 0x00FFFF:
        case 0xB200FF:
        case 0xFFFFFF: return tileIDs.floor;

        case 0x0026FF: return tileIDs.wall;

        case 0x808080: return tileIDs.powerblock;

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

export const renderTile = (colorOrImage, x, y) => {
    if(typeof colorOrImage === "string") {
        gfx.fillStyle = colorOrImage;
        gfx.fillRect(48+x*32, 12+y*32, 32, 32);
    }
    else {
        gfx.drawImage(colorOrImage, 48+x*32, 12+y*32, 32, 32);
    }

    // For debug:
    //gfx.strokeStyle = "red";
    //gfx.strokeRect(48+x*32, 12+y*32, 32, 32);
}

