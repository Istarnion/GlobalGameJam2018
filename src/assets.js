export const images = {
    // Key Value
    water: "res/water.png", // This can actually be an internet URL too, I think. But probably shouldn't
    slime: "res/slimeWIP.png",
    floor1: "res/sprites/FloorTileBaseAlt.png",
    wall1: "res/sprites/Wall1.png",
    wall2: "res/sprites/Wall2.png",
    chasm: "res/sprites/Void.png",
    emitter: "res/sprites/Emitter.png",
    powerBot: "res/sprites/PowerBot.png",
    magnetBot: "res/sprites/MagnetBot.png",
    mirrorBot: "res/sprites/RelayBot.png"
};

export const animations = {
    powerBotDown: {
        image: "powerBot",
        timePerFrame: 0.3,
        looping: "once",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 }
        ]
    },
    powerBotIdle: {
        image: "powerBot",
        timePerFrame: 0.3,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 },
            { x: 64, y: 0, w: 32, h: 32 }
        ]
    },
    powerBotWalk: {
        image: "powerBot",
        timePerFrame: 0.3,
        looping: "ping-pong",
        frames: [
            { x: 64, y: 0, w: 32, h: 32 },
            { x: 96, y: 0, w: 32, h: 32 },
            { x: 128, y: 0, w: 32, h: 32 }
        ]
    },
    magnetBotDown: {
        image: "magnetBot",
        timePerFrame: 0.3,
        looping: "once",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 }
        ]
    },
    magnetBotIdle: {
        image: "magnetBot",
        timePerFrame: 0.3,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 },
            { x: 64, y: 0, w: 32, h: 32 }
        ]
    },
    magnetBotWalk: {
        image: "magnetBot",
        timePerFrame: 0.3,
        looping: "ping-pong",
        frames: [
            { x: 64, y: 0, w: 32, h: 32 },
            { x: 96, y: 0, w: 32, h: 32 },
            { x: 128, y: 0, w: 32, h: 32 }
        ]
    },
    mirrorBotDown: {
        image: "mirrorBot",
        timePerFrame: 0.3,
        looping: "once",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 }
        ]
    },
    mirrorBotIdle: {
        image: "mirrorBot",
        timePerFrame: 0.3,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 },
            { x: 64, y: 0, w: 32, h: 32 }
        ]
    },
    mirrorBotWalk: {
        image: "mirrorBot",
        timePerFrame: 0.3,
        looping: "ping-pong",
        frames: [
            { x: 64, y: 0, w: 32, h: 32 },
            { x: 96, y: 0, w: 32, h: 32 },
            { x: 128, y: 0, w: 32, h: 32 }
        ]
    }
};

