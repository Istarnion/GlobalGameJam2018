export const images = {
    // Key Value
    water: "res/water.png", // This can actually be an internet URL too, I think. But probably shouldn't
    slime: "res/slimeWIP.png"
};

export const animations = {
    // Example: 4 different ways to load animations
    water1: {
        image: "water",
        timePerFrame: 0.3,
        looping: "loop", // Can be "once", "loop", or "ping-pong"
        frames: 3 // Say that there are N frames, horizontally, no spacing. Filling the entire image
    },
    water2: {
        image: "water",
        timePerFrame: 0.3,
        looping: "loop",
        frames: { x: 3, y: 1 } // Say that there are X frames across, and Y frames down
    },
    water3: {
        image: "water",
        timePerFrame: 0.3,
        looping: "loop",
        frames: { x: 3, y: 1, mx: 0, my: 0, sx: 0, sy: 0 } // Same as above, but with margin and spacing
    },
    water4: {
        image: "water",
        timePerFrame: 0.3,
        looping: "loop",
        frames: [   // Array of frames
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 },
            { x: 64, y: 0, w: 32, h: 32 }
        ]
    },
    slimeIdle: {
        image: "slime",
        timePerFrame: 0.1,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 },
            { x: 64, y: 0, w: 32, h: 32 },
            { x: 96, y: 0, w: 32, h: 32 },
            { x: 128, y: 0, w: 32, h: 32 },
            { x: 160, y: 0, w: 32, h: 32 }
        ]
    },
    slimeJump: {
        image: "slime",
        timePerFrame: 0.1,
        looping: "once",
        frames: [
            { x: 0, y: 32, w: 32, h: 32 },
            { x: 32, y: 32, w: 32, h: 32 },
            { x: 64, y: 32, w: 32, h: 32 },
            { x: 96, y: 32, w: 32, h: 32 },
            { x: 128, y: 32, w: 32, h: 32 },
            { x: 160, y: 32, w: 32, h: 32 }
        ]
    },
    slimeDie: {
        image: "slime",
        timePerFrame: 0.1,
        looping: "once",
        frames: [
            { x: 0, y: 64, w: 32, h: 32 },
            { x: 32, y: 64, w: 32, h: 32 },
            { x: 64, y: 64, w: 32, h: 32 },
            { x: 96, y: 64, w: 32, h: 32 },
            { x: 128, y: 64, w: 32, h: 32 },
            { x: 160, y: 64, w: 32, h: 32 }
        ]
    }
};

