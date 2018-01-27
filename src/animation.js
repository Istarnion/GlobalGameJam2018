import { gfx, sprites } from "./graphics.js";
import { getPropertyOrDefault, requireProperty } from "./utils.js";
import { Directions } from "./utils.js";

export class Animation {

    constructor(def) {
        const image = requireProperty(def, "image");
        this.spriteSheet = sprites[image];
        this.timePerFrame = getPropertyOrDefault(def, "timePerFrame", 0.5);
        this.looping = getPropertyOrDefault(def, "looping", "once");

        this.frames = [];

        if(typeof def.frames === "number") {
            // Animation strip
            const frameWidth = this.spriteSheet.width / def.frames;
            const frameHeight = this.spriteSheet.height;
            for(let i=0; i<def.frames; ++i) {
                this.frames.push({
                    x: i * frameWidth,
                    y: 0,
                    w: frameWidth,
                    h: frameHeight
                });
            }
        }
        else if(!!def.frames.x && !!def.frames.y) {
            // Sprite sheet
            const framesAcross = def.frames.x;
            const framesDown = def.frames.y;
            const marginX = getPropertyOrDefault(def.frames, "mx", 0);
            const marginY = getPropertyOrDefault(def.frames, "my", 0);
            const spacingX = getPropertyOrDefault(def.frames, "sx", 0);
            const spacingY = getPropertyOrDefault(def.frames, "sy", 0);

            const frameWidth = (this.spriteSheet.width - marginX - framesAcross * spacingX) / framesAcross;
            const frameHeight = (this.spriteSheet.height - marginY - framesDown * spacingY) / framesDown;

            for(let i=0; i<framesDown; ++i) {
                for(let j=0; j<framesAcross; ++j) {
                    this.frames.push({
                        x: marginX + j * (frameWidth + spacingX),
                        y: marginY + i * (frameHeight + spacingY),
                        w: frameWidth,
                        h: frameHeight
                    });
                }
            }
        }
        else {
            // Array of frames
            for(const frame of def.frames) {
                this.frames.push(frame);
            }
        }

        this.cycleListeners = [];
        this.frameListeners = [];

        this.timeOnCurrentFrame = 0;
        this.currentFrame = 0;
        this.paused = false;
        this.direction = 1;
    }

    update(deltaTime) {
        if(!this.paused) {
            this.timeOnCurrentFrame += deltaTime;
            if(this.timeOnCurrentFrame >= this.timePerFrame) {
                this.timeOnCurrentFrame = 0;
                this.currentFrame += this.direction;

                if(this.direction !== 0) {
                    for(const listener of this.frameListeners) {
                        listener(this.currentFrame, this);
                    }
                }

                if(this.currentFrame >= this.numFrames || this.currentFrame < 0) {
                    // NOTE(istarnion): We support animating bot ways, in all modes.
                    switch(this.looping) {
                        case "once":
                            this.currentFrame -= this.direction;
                            this.direction = 0;
                            break;
                        case "loop":
                            this.currentFrame -= this.direction;
                            this.currentFrame = this.numFrames - 1 - this.currentFrame;
                            break;
                        case "ping-pong":
                            if(this.currentFrame < 0) this.currentFrame = 0;
                            else if(this.currentFrame >= this.numFrames) this.currentFrame = this.numFrames - 1;
                            this.currentFrame -= this.direction;
                            this.direction *= -1;
                            break;
                    }

                    for(const listener of this.cycleListeners) {
                        listener(this);
                    }
                }
            }
        }
    }

    draw(x, y, offsetX, offsetY, dir) {
        gfx.save();
        gfx.translate(48+x*32+16, 12+y*32+16);

        switch(dir) {
            case Directions.up: break;
            case Directions.right:
                gfx.rotate(Math.PI / 2)
                break;
            case Directions.down:
                gfx.rotate(Math.PI);
                break;
            case Directions.left:
                gfx.rotate(Math.PI / -2);
                break;
        }

        const frame = this.frames[this.currentFrame];
        gfx.drawImage(this.spriteSheet, frame.x, frame.y, frame.w, frame.h, -16, -16, 32, 32);

        gfx.restore();
    }

    reset() {
        this.currentFrame = 0;
        this.timeOnCurrentFrame = 0;
        this.paused = false;
        this.direction = 1;
    }

    addCycleListener(listener) {
        this.cycleListeners.push(listener);
    }

    addFrameListener(listener) {
        this.frameListeners.push(listener);
    }

    get numFrames() {
        return this.frames.length;
    }
}

