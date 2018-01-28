export const images = {
    menuBG: "res/sprites/MenuScreenBackground.png",
    creditsBG: "res/sprites/CreditsScreen.png",
    playButton: "res/sprites/MainMenuPlayButton.png",
    creditsButton: "res/sprites/MainMenuCreditsButton.png",
    backButton: "res/sprites/BackButton.png",

    floor1: "res/sprites/FloorTileBaseAlt.png",
    wall1: "res/sprites/Wall1.png",
    wall2: "res/sprites/Wall2.png",
    chasm: "res/sprites/Void.png",
    emitter: "res/sprites/Emitter.png",
    powerBot: "res/sprites/PowerBot.png",
    magnetBot: "res/sprites/MagnetBot.png",
    mirrorBot: "res/sprites/RelayBot.png",

    wire_ne: "res/sprites/WireNE.png",
    wire_nw: "res/sprites/WireNW.png",
    wire_se: "res/sprites/WireSE.png",
    wire_sw: "res/sprites/WireSW.png",
    wire_h: "res/sprites/WireHorizontal.png",
    wire_v: "res/sprites/WireVertical.png",
    wire_powered_ne: "res/sprites/WireNEPowered.png",
    wire_powered_nw: "res/sprites/WireNWPowered.png",
    wire_powered_se: "res/sprites/WireSEPowered.png",
    wire_powered_sw: "res/sprites/WireSWPowered.png",
    wire_powered_h: "res/sprites/WireHorizontalPowered.png",
    wire_powered_v: "res/sprites/WireVerticalPowered.png",

    block: "res/sprites/Block.png",
    powerBlock: "res/sprites/PowerBlock.png",
    horizontalDoor: "res/sprites/DoorVertical.png",
    verticalDoor: "res/sprites/DoorHorizontal.png",

    laser: "res/sprites/LaserbeamGREEN.png",
    laser_ne: "res/sprites/LaserbeamGREENNE.png",
    laser_nw: "res/sprites/LaserbeamGREENNW.png",
    laser_se: "res/sprites/LaserbeamGREENSE.png",
    laser_sw: "res/sprites/LaserbeamGREENSW.png",

    mirror_ne: "res/sprites/MirrorBlockNE.png",
    mirror_nw: "res/sprites/MirrorBlockNW.png",
    mirror_se: "res/sprites/MirrorBlockSE.png",
    mirror_sw: "res/sprites/MirrorBlockSW.png",

    goal: "res/sprites/MainframeGoal.png",

    cursor: "res/sprites/CursorCorner.png",

    tutorial: "res/sprites/TutorialTextFinish.png"
};

export const animations = {
    block: {
        image: "block",
        timePerFrame: 0.1,
        looping: "once",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 },
            { x: 64, y: 0, w: 32, h: 32 }
        ]
    },
    emitter: {
        image: "emitter",
        timePerFrame: 0.3,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 }
        ]
    },
    laser: {
        image: "laser",
        timePerFrame: 0.05,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 }
        ]
    },
    laser_ne: {
        image: "laser_ne",
        timePerFrame: 0.05,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 }
        ]
    },
    laser_nw: {
        image: "laser_nw",
        timePerFrame: 0.05,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 }
        ]
    },
    laser_se: {
        image: "laser_se",
        timePerFrame: 0.05,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 }
        ]
    },
    laser_sw: {
        image: "laser_sw",
        timePerFrame: 0.05,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 }
        ]
    },
    goal: {
        image: "goal",
        timePerFrame: 0.2,
        looping: "loop",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 }
        ]
    },
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
    },
    powerBlock: {
        image: "powerBlock",
        timePerFrame: 0.0,
        looping: "once",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 }
        ]
    },

    horizontalDoorOpen: {
        image: "horizontalDoor",
        timePerFrame: 0.2,
        looping: "once",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 },
            { x: 64, y: 0, w: 32, h: 32 }
        ]
    },
    horizontalDoorClose: {
        image: "horizontalDoor",
        timePerFrame: 0.2,
        looping: "once",
        frames: [
            { x: 64, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 },
            { x: 0, y: 0, w: 32, h: 32 },
        ]
    },
    verticalDoorOpen: {
        image: "verticalDoor",
        timePerFrame: 0.2,
        looping: "once",
        frames: [
            { x: 0, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 },
            { x: 64, y: 0, w: 32, h: 32 }
        ]
    },
    verticalDoorClose: {
        image: "verticalDoor",
        timePerFrame: 0.2,
        looping: "once",
        frames: [
            { x: 64, y: 0, w: 32, h: 32 },
            { x: 32, y: 0, w: 32, h: 32 },
            { x: 0, y: 0, w: 32, h: 32 },
        ]
    }
};

