export const input = {
    keyDownListeners: [],
    specificKeyDownListeners: {},
    keyUpListeners: [],
    specificKeyUpListeners: {},

    // Arguments: Either a keyname and function, or just a function
    isKeyDown: function(key) {
        return !!this.currentKeyState[key];
    },

    isKeyJustPressed: function(key) {
        const result =
            !!this.currentKeyState[key] &&
            !this.prevKeyState[key];
        return result;
    },

    isKeyJustReleased: function(key) {
        const result =
            !this.currentKeyState[key] &&
            !!this.prevKeyState[key];
        return result;
    },

    addKeyDownListener: function() {
        if(typeof arguments[0] === "string") {
            // Listener for specific key
            if(this.specificKeyDownListeners.hasOwnProperty(arguments[0])) {
                this.specificKeyDownListeners[arguments[0]].push(arguments[1]);
            }
            else {
                this.specificKeyDownListeners[arguments[0]] = [arguments[1]];
            }
        }
        else {
            // Listener for any key
            this.keyDownListeners.push(arguments[0]);
        }
    },

    addKeyUpListener: function() {
        if(typeof arguments[0] === "string") {
            // Listener for specific key
            if(this.specificKeyUpListeners.hasOwnProperty(arguments[0])) {
                this.specificKeyUpListeners[arguments[0]].push(arguments[1]);
            }
            else {
                this.specificKeyUpListeners[arguments[0]] = [arguments[1]];
            }
        }
        else {
            // Listener for any key
            this.keyUpListeners.push(arguments[0]);
        }
    },

    removeKeyDownListener: function(f) {
        // TODO(istarnion): Implement!
    },

    removeKeyUpListener: function(f) {
        // TODO(istarnion): Implement!
    },

    update: function() {
        // Called by the main loop to broadcast events
        for(const key in this.currentKeyState) {
            if(this.currentKeyState.hasOwnProperty(key)) {
                const currState = this.currentKeyState[key];
                const prevState = this.prevKeyState[key];

                if(currState && !prevState) {
                    // console.log(`Key down: ${key}`);
                    if(this.specificKeyDownListeners.hasOwnProperty(key)) {
                        for(const listener of this.specificKeyDownListeners[key]) {
                            listener(key);
                        }
                    }

                    for(const listener of this.keyDownListeners) {
                        listener(key);
                    }
                }
                else if(!currState && prevState) {
                    if(this.specificKeyUpListeners.hasOwnProperty(key)) {
                        for(const listener of this.specificKeyUpListeners[key]) {
                            listener(key);
                        }
                    }

                    for(const listener of this.keyUpListeners) {
                        listener(key);
                    }
                }

                this.prevKeyState[key] = this.currentKeyState[key];
            }
        }
    },

    currentKeyState: {
        z: false,
        x: false,
        c: false,
        space: false,
        enter: false,
        up: false,
        down: false,
        left: false,
        right: false,
        w: false,
        a: false,
        s: false,
        d: false,
        q: false,
        e: false,
        f: false
    },

    prevKeyState: {
        z: false,
        x: false,
        c: false,
        space: false,
        enter: false,
        up: false,
        down: false,
        left: false,
        right: false,
        w: false,
        a: false,
        s: false,
        d: false,
        q: false,
        e: false,
        f: false
    }
};

const getKeyNameFromCode = (code) => {
    let key = false;
    switch(code) {
        case "KeyZ": key = "z"; break;
        case "KeyX": key = "x"; break;
        case "KeyC": key = "c"; break;
        case "Space": key = "space"; break;
        case "Enter": key = "enter"; break;
        case "ArrowUp": key = "up"; break;
        case "ArrowDown": key = "down"; break;
        case "ArrowLeft": key = "left"; break;
        case "ArrowRight": key = "right"; break;
        case "KeyW": key = "w"; break;
        case "KeyA": key = "a"; break;
        case "KeyS": key = "s"; break;
        case "KeyD": key = "d"; break;
        case "KeyQ": key = "q"; break;
        case "KeyE": key = "e"; break;
        case "KeyF": key = "f"; break;
        default: break;
    }

    return key;
};

window.addEventListener("keydown", (e) => {
    const key = getKeyNameFromCode(e.code);
    if(key) {
        input.currentKeyState[key] = true;
    }
});

window.addEventListener("keyup", (e) => {
    const key = getKeyNameFromCode(e.code);
    if(key) {
        input.currentKeyState[key] = false;
    }
});

