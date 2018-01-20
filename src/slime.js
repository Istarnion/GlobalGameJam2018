import { gfx, sprites } from "./graphics.js";
import { animations } from "./assets.js";
import { Animation } from "./animation.js";
import { input } from "./input.js";

export class Slime {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.idle = new Animation(animations.slimeIdle);
        this.jump = new Animation(animations.slimeJump);
        this.die = new Animation(animations.slimeDie);

        this.currAnim = this.jump;
        this.deathTimer = 0;
        this.jumpCounter = 0;

        this.jump.addCycleListener(() => {
            this.idle.reset();
            this.currAnim = this.idle;
        });

        input.addKeyDownListener("space", () => {
            if(this.currAnim === this.idle) {
                if(this.jumpCounter < 3) {
                    this.jump.reset();
                    this.currAnim = this.jump;
                    this.jumpCounter++;
                }
                else {
                    this.die.reset();
                    this.currAnim = this.die;
                    this.jumpCounter = 0;
                }
            }
        });
    }

    updateAndRender(deltaTime) {
        if(this.currAnim === this.die) {
            this.deathTimer += deltaTime;
            if(this.deathTimer > 3) {
                this.jump.reset();
                this.currAnim = this.jump;
                this.deathTimer = 0;
            }
        }

        this.currAnim.update(deltaTime);
        this.currAnim.draw(this.x, this.y);
    }
}

