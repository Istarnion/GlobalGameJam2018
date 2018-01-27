import {Howl, Howler } from "./howler.min.js";

class MusicManager {
    constructor() {
        // Load sounds
        this.sounds = {};
        this.sounds.echo = new Howl({ 
            src: ['/res/sounds/SFXEcho.mp3'], 
        });
        this.sounds.blockDrag = new Howl({ 
            src: ['/res/sounds/SFXBlockDrag.mp3'], 
        });
        // Load music
        this.music = {};
        this.music.startDrone = new Howl({
                src: ['/res/sounds/BassDrone_Start.mp3'],
                onend: () => {
                    this.music.loopDrone.play();
                }
        });
        this.music.loopDrone = new Howl({
                src: ['/res/sounds/BassDrone_Cont.mp3'],
                loop: true,
        });
    }


    startMusic () {}

    playSound (action) { 
        this.sounds[action].play();
    }
    

    beginLevel () {
        // fade inn?
        this.music.startDrone.play();
        
        
    }

    endLevel () {
        // fade out...
    }


}

export const musicManager = new MusicManager();

