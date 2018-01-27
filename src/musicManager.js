import {Howl, Howler } from "./howler.min.js";

class MusicManager {
    constructor() {
        this.timeToPlayAmbientsound = 10;
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

        // Load ambientSounds
        this.ambientSounds = [];
        this.ambientSounds.push(
            new Howl({ src: ['res/sounds/ambience_01.ogg'] }),
            new Howl({ src: ['res/sounds/ambience_02.ogg'] }),
            new Howl({ src: ['res/sounds/ambience_03.ogg'] }),
            new Howl({ src: ['res/sounds/ambience_04.ogg'] }),
            new Howl({ src: ['res/sounds/ambience_05.ogg'] }),
            new Howl({ src: ['res/sounds/ambience_06.ogg'] }),
            new Howl({ src: ['res/sounds/ambience_07.ogg'] }),
            new Howl({ src: ['res/sounds/ambience_08.ogg'] }),
            new Howl({ src: ['res/sounds/ambience_09.ogg'] }),
            new Howl({ src: ['res/sounds/ambience_10.ogg'] })
        );
    }
    update (deltaTime) { 
        this.timeToPlayAmbientsound -= deltaTime;
        if (this.timeToPlayAmbientsound <= 0 ) {
            this.timeToPlayAmbientsound = 7 + Math.random() * 15 - 7;
            this.playAmbient(Math.floor(Math.random() * 10));
        }
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

    playAmbient (index) {
        this.ambientSounds[index].play();
    }

}

export const musicManager = new MusicManager();

