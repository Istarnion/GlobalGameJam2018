/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.drawSprite = exports.getBitmap = exports.loadImages = exports.loadImage = exports.sprites = exports.clear = exports.setGameSize = exports.gfx = undefined;

var _utils = __webpack_require__(2);

var canvas = document.getElementById("game-canvas");
var gfx = exports.gfx = canvas.getContext("2d");

// Turn off anti-aliasing for images.
var disableAntiAlias = function disableAntiAlias() {
    gfx.mozImageSmoothingEnabled = false;
    gfx.webkitImageSmoothingEnabled = false;
    gfx.msImageSmoothingEnabled = false;
    gfx.imageSmoothingEnabled = false;
};

var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
gfx.scale(pixelRatio, pixelRatio);
gfx.save(); // Save the default scale (transform)

gfx.width = canvas.clientWidth;
gfx.height = canvas.clientHeight;

var last_resize = 0;
var onResize = function onResize() {
    var now = performance.now();
    if (now - last_resize < 10) return;
    last_resize = now;

    var w = window.innerWidth;
    var h = window.innerHeight;

    var wanted_ratio = gfx.width / gfx.height;
    var curr_ratio = w / h;

    var scale = 1;

    if (curr_ratio >= wanted_ratio) {
        scale = h / gfx.height;
        if (scale > 1) scale = Math.floor(scale);
    } else {
        scale = w / gfx.width;
        if (scale > 1) scale = Math.floor(scale);
    }

    canvas.width = gfx.width * scale * pixelRatio;
    canvas.height = gfx.height * scale * pixelRatio;
    canvas.style.width = gfx.width * scale + "px";
    canvas.style.height = gfx.height * scale + "px";

    gfx.restore(); // Restore default scale
    gfx.save(); // ...and save it again
    gfx.scale(scale * pixelRatio, scale * pixelRatio);
    disableAntiAlias();
};

window.addEventListener("resize", onResize);

gfx.drawLine = function (x_from, y_from, x_to, y_to) {
    undefined.gfx.beginPath();
    undefined.gfx.moveTo(x_from, y_from);
    undefined.gfx.lineTo(x_to, y_to);
    undefined.gfx.closePath();
    undefined.gfx.stroke();
};

var setGameSize = exports.setGameSize = function setGameSize(w, h) {
    gfx.width = w;
    gfx.height = h;
    onResize();
};

// Clear the canvas
var clear = exports.clear = function clear() {
    gfx.clearRect(0, 0, gfx.width, gfx.height);
};

// A cache of loaded sprites. Access them by sprites[sprite_name]
var sprites = exports.sprites = {};

// Load a single image. Input format: ["name", "file"]
var loadImage = exports.loadImage = function loadImage(image_to_load) {
    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.onload = function () {
            sprites[image_to_load[0]] = image;
            resolve();
        };

        image.onerror = function () {
            reject(image_to_load);
        };

        image.src = image_to_load[1];
    });
};

// Load multiple images. Input format; [["name1", "file1"], ["name2", "file2"], ...]
var loadImages = exports.loadImages = function loadImages(images_to_load) {
    return new Promise(function (resolve, reject) {
        if (images_to_load.length === 0) {
            resolve();
            return;
        }

        var image_promises = [];

        images_to_load.forEach(function (image) {
            image_promises.push(loadImage(image));
        });

        Promise.all(image_promises).then(function () {
            resolve();
        }).catch(function (failed_images) {
            reject(failed_images);
        });
    });
};

// Get the pixel data for the given image.
// The image must have been loaded.
// This function returns an object like this:
// { width: ***, height: ***, pixels: ***..., getPixel(x, y)},
// or null, if something goes wrong.
// A single pixel is on the form { r: 0-255, g: 0-255, b: 0-255, a: 0-255 }
var getBitmap = exports.getBitmap = function getBitmap(image) {
    var img = sprites[image];
    if (!img) {
        console.error(image + " is not loaded");
        return null;
    }

    var tempCanvas = document.createElement("canvas");
    var ctx = tempCanvas.getContext("2d");

    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    ctx.clearRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);

    var result = {
        width: img.width,
        height: img.height,
        pixels: ctx.getImageData(0, 0, img.width, img.height).data,
        getPixel: function getPixel(x, y) {
            var start = y * this.width * 4 + x * 4;
            var pixel = {
                r: this.pixels[start + 0],
                g: this.pixels[start + 1],
                b: this.pixels[start + 2],
                a: this.pixels[start + 3]
            };

            return pixel;
        }
    };

    return result;
};

var drawSprite = exports.drawSprite = function drawSprite(colorOrImage, x, y) {
    var offsetX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var offsetY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var dir = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _utils.Directions.up;

    gfx.save();
    gfx.translate(48 + x * 32 + 16 + offsetX, 12 + y * 32 + 16 + offsetY);

    switch (dir) {
        case _utils.Directions.up:
            break;
        case _utils.Directions.right:
            gfx.rotate(Math.PI / 2);
            break;
        case _utils.Directions.down:
            gfx.rotate(Math.PI);
            break;
        case _utils.Directions.left:
            gfx.rotate(Math.PI / -2);
            break;
    }

    if (typeof colorOrImage === "string") {
        gfx.fillStyle = colorOrImage;
        gfx.fillRect(-16, -16, 32, 32);
    } else {
        gfx.drawImage(colorOrImage, -16, -16, 32, 32);
    }

    gfx.restore();
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var images = exports.images = {
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

var animations = exports.animations = {
    block: {
        image: "block",
        timePerFrame: 0.1,
        looping: "once",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }, { x: 64, y: 0, w: 32, h: 32 }]
    },
    emitter: {
        image: "emitter",
        timePerFrame: 0.3,
        looping: "once",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }]
    },
    laser: {
        image: "laser",
        timePerFrame: 0.05,
        looping: "loop",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }]
    },
    laser_ne: {
        image: "laser_ne",
        timePerFrame: 0.05,
        looping: "loop",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }]
    },
    laser_nw: {
        image: "laser_nw",
        timePerFrame: 0.05,
        looping: "loop",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }]
    },
    laser_se: {
        image: "laser_se",
        timePerFrame: 0.05,
        looping: "loop",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }]
    },
    laser_sw: {
        image: "laser_sw",
        timePerFrame: 0.05,
        looping: "loop",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }]
    },
    goal: {
        image: "goal",
        timePerFrame: 0.2,
        looping: "loop",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }]
    },
    powerBotDown: {
        image: "powerBot",
        timePerFrame: 0.3,
        looping: "once",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }]
    },
    powerBotIdle: {
        image: "powerBot",
        timePerFrame: 0.3,
        looping: "loop",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 64, y: 0, w: 32, h: 32 }]
    },
    powerBotWalk: {
        image: "powerBot",
        timePerFrame: 0.3,
        looping: "ping-pong",
        frames: [{ x: 64, y: 0, w: 32, h: 32 }, { x: 96, y: 0, w: 32, h: 32 }, { x: 128, y: 0, w: 32, h: 32 }]
    },
    magnetBotDown: {
        image: "magnetBot",
        timePerFrame: 0.3,
        looping: "once",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }]
    },
    magnetBotIdle: {
        image: "magnetBot",
        timePerFrame: 0.3,
        looping: "loop",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 64, y: 0, w: 32, h: 32 }]
    },
    magnetBotWalk: {
        image: "magnetBot",
        timePerFrame: 0.3,
        looping: "ping-pong",
        frames: [{ x: 64, y: 0, w: 32, h: 32 }, { x: 96, y: 0, w: 32, h: 32 }, { x: 128, y: 0, w: 32, h: 32 }]
    },
    mirrorBotDown: {
        image: "mirrorBot",
        timePerFrame: 0.3,
        looping: "once",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }]
    },
    mirrorBotIdle: {
        image: "mirrorBot",
        timePerFrame: 0.3,
        looping: "loop",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 64, y: 0, w: 32, h: 32 }]
    },
    mirrorBotWalk: {
        image: "mirrorBot",
        timePerFrame: 0.3,
        looping: "ping-pong",
        frames: [{ x: 64, y: 0, w: 32, h: 32 }, { x: 96, y: 0, w: 32, h: 32 }, { x: 128, y: 0, w: 32, h: 32 }]
    },
    powerBlock: {
        image: "powerBlock",
        timePerFrame: 0.0,
        looping: "once",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }]
    },

    horizontalDoorOpen: {
        image: "horizontalDoor",
        timePerFrame: 0.2,
        looping: "once",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }, { x: 64, y: 0, w: 32, h: 32 }]
    },
    horizontalDoorClose: {
        image: "horizontalDoor",
        timePerFrame: 0.2,
        looping: "once",
        frames: [{ x: 64, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }, { x: 0, y: 0, w: 32, h: 32 }]
    },
    verticalDoorOpen: {
        image: "verticalDoor",
        timePerFrame: 0.2,
        looping: "once",
        frames: [{ x: 0, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }, { x: 64, y: 0, w: 32, h: 32 }]
    },
    verticalDoorClose: {
        image: "verticalDoor",
        timePerFrame: 0.2,
        looping: "once",
        frames: [{ x: 64, y: 0, w: 32, h: 32 }, { x: 32, y: 0, w: 32, h: 32 }, { x: 0, y: 0, w: 32, h: 32 }]
    }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var getPropertyOrDefault = exports.getPropertyOrDefault = function getPropertyOrDefault(obj, prop, def) {
    if (obj.hasOwnProperty(prop)) return obj[prop];else return def;
};

var requireProperty = exports.requireProperty = function requireProperty(obj, prop) {
    if (obj.hasOwnProperty(prop) && !!obj[prop]) return obj[prop];else {
        console.error("The property " + prop + " is required in " + obj + ", but is not present!");
        return obj[prop];
    }
};

// Removes the given element from the given array.
// Returns true if the element was found and removed,
// false otherwise.
var removeFromArray = exports.removeFromArray = function removeFromArray(array, element) {
    var index = array.indexOf(element);
    if (index >= 0) {
        array.splice(index, 1);
        return true;
    }

    return false;
};

var Directions = exports.Directions = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Animation = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphics = __webpack_require__(0);

var _utils = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animation = exports.Animation = function () {
    function Animation(def) {
        _classCallCheck(this, Animation);

        var image = (0, _utils.requireProperty)(def, "image");
        this.spriteSheet = _graphics.sprites[image];
        this.timePerFrame = (0, _utils.getPropertyOrDefault)(def, "timePerFrame", 0.5);
        this.looping = (0, _utils.getPropertyOrDefault)(def, "looping", "once");

        this.frames = [];

        if (typeof def.frames === "number") {
            // Animation strip
            var frameWidth = this.spriteSheet.width / def.frames;
            var frameHeight = this.spriteSheet.height;
            for (var i = 0; i < def.frames; ++i) {
                this.frames.push({ x: i * frameWidth,
                    y: 0,
                    w: frameWidth,
                    h: frameHeight
                });
            }
        } else if (!!def.frames.x && !!def.frames.y) {
            // Sprite sheet
            var framesAcross = def.frames.x;
            var framesDown = def.frames.y;
            var marginX = (0, _utils.getPropertyOrDefault)(def.frames, "mx", 0);
            var marginY = (0, _utils.getPropertyOrDefault)(def.frames, "my", 0);
            var spacingX = (0, _utils.getPropertyOrDefault)(def.frames, "sx", 0);
            var spacingY = (0, _utils.getPropertyOrDefault)(def.frames, "sy", 0);

            var _frameWidth = (this.spriteSheet.width - marginX - framesAcross * spacingX) / framesAcross;
            var _frameHeight = (this.spriteSheet.height - marginY - framesDown * spacingY) / framesDown;

            for (var _i = 0; _i < framesDown; ++_i) {
                for (var j = 0; j < framesAcross; ++j) {
                    this.frames.push({
                        x: marginX + j * (_frameWidth + spacingX),
                        y: marginY + _i * (_frameHeight + spacingY),
                        w: _frameWidth,
                        h: _frameHeight
                    });
                }
            }
        } else {
            // Array of frames
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = def.frames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var frame = _step.value;

                    this.frames.push(frame);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        this.cycleListeners = [];
        this.frameListeners = [];

        this.timeOnCurrentFrame = 0;
        this.currentFrame = 0;
        this.paused = false;
        this.direction = 1;
    }

    _createClass(Animation, [{
        key: "update",
        value: function update(deltaTime) {
            if (!this.paused) {
                this.timeOnCurrentFrame += deltaTime;
                if (this.timeOnCurrentFrame >= this.timePerFrame) {
                    this.timeOnCurrentFrame = 0;
                    this.currentFrame += this.direction;

                    if (this.direction !== 0) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = this.frameListeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var listener = _step2.value;

                                listener(this.currentFrame, this);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    }

                    if (this.currentFrame >= this.numFrames || this.currentFrame < 0) {
                        // NOTE(istarnion): We support animating bot ways, in all modes.
                        switch (this.looping) {
                            case "once":
                                this.currentFrame -= this.direction;
                                this.direction = 0;
                                break;
                            case "loop":
                                this.currentFrame -= this.direction;
                                this.currentFrame = this.numFrames - 1 - this.currentFrame;
                                break;
                            case "ping-pong":
                                if (this.currentFrame < 0) this.currentFrame = 0;else if (this.currentFrame >= this.numFrames) this.currentFrame = this.numFrames - 1;
                                this.currentFrame -= this.direction;
                                this.direction *= -1;
                                break;
                        }

                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = this.cycleListeners[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _listener = _step3.value;

                                _listener(this);
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }
                }
            }
        }
    }, {
        key: "draw",
        value: function draw(x, y) {
            var offsetX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var offsetY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var dir = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _utils.Directions.up;

            _graphics.gfx.save();
            _graphics.gfx.translate(48 + x * 32 + 16 + offsetX, 12 + y * 32 + 16 + offsetY);

            switch (dir) {
                case _utils.Directions.up:
                    break;
                case _utils.Directions.right:
                    _graphics.gfx.rotate(Math.PI / 2);
                    break;
                case _utils.Directions.down:
                    _graphics.gfx.rotate(Math.PI);
                    break;
                case _utils.Directions.left:
                    _graphics.gfx.rotate(Math.PI / -2);
                    break;
            }

            var frame = this.frames[this.currentFrame];
            _graphics.gfx.drawImage(this.spriteSheet, frame.x, frame.y, frame.w, frame.h, -16, -16, 32, 32);

            _graphics.gfx.restore();
        }
    }, {
        key: "reset",
        value: function reset() {
            this.currentFrame = 0;
            this.timeOnCurrentFrame = 0;
            this.paused = false;
            this.direction = 1;
        }
    }, {
        key: "addCycleListener",
        value: function addCycleListener(listener) {
            this.cycleListeners.push(listener);
        }
    }, {
        key: "addFrameListener",
        value: function addFrameListener(listener) {
            this.frameListeners.push(listener);
        }
    }, {
        key: "numFrames",
        get: function get() {
            return this.frames.length;
        }
    }]);

    return Animation;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var input = exports.input = {
    keyDownListeners: [],
    specificKeyDownListeners: {},
    keyUpListeners: [],
    specificKeyUpListeners: {},

    // Arguments: Either a keyname and function, or just a function
    isKeyDown: function isKeyDown(key) {
        return !!this.keyStates[key][0];
    },

    isKeyJustPressed: function isKeyJustPressed(key) {
        var result = this.keyStates[key][0] && !this.keyStates[key][1];
        return result;
    },

    isKeyJustReleased: function isKeyJustReleased(key) {
        var result = !this.keyStates[key][0] && this.keyStates[key][1];
        return result;
    },

    addKeyDownListener: function addKeyDownListener() {
        if (typeof arguments[0] === "string") {
            // Listener for specific key
            if (this.specificKeyDownListeners.hasOwnProperty(arguments[0])) {
                this.specificKeyDownListeners[arguments[0]].push(arguments[1]);
            } else {
                this.specificKeyDownListeners[arguments[0]] = [arguments[1]];
            }
        } else {
            // Listener for any key
            this.keyDownListeners.push(arguments[0]);
        }
    },

    addKeyUpListener: function addKeyUpListener() {
        if (typeof arguments[0] === "string") {
            // Listener for specific key
            if (this.specificKeyUpListeners.hasOwnProperty(arguments[0])) {
                this.specificKeyUpListeners[arguments[0]].push(arguments[1]);
            } else {
                this.specificKeyUpListeners[arguments[0]] = [arguments[1]];
            }
        } else {
            // Listener for any key
            this.keyUpListeners.push(arguments[0]);
        }
    },

    removeKeyDownListener: function removeKeyDownListener(f) {
        for (var key in this.specificKeyDownListeners) {
            if (this.specificKeyDownListeners.hasOwnProperty(key)) {
                if (removeFromArray(this.specificKeyDownListeners[key], f)) {
                    return;
                }
            }
        }

        removeFromArray(this.keyDownListeners, f);
    },

    removeKeyUpListener: function removeKeyUpListener(f) {
        for (var key in this.specificKeyUpListeners) {
            if (this.specificKeyUpListeners.hasOwnProperty(key)) {
                if (removeFromArray(this.specificKeyUpListeners[key], f)) {
                    return;
                }
            }
        }

        removeFromArray(this.keyUpListeners, f);
    },

    update: function update() {
        // Called by the main loop to broadcast events
        for (var key in this.keyStates) {
            if (this.keyStates.hasOwnProperty(key)) {
                var currState = !!this.keyStates[key][0];
                var prevState = !!this.keyStates[key][1];

                if (currState && !prevState) {
                    // console.log(`Key down: ${key}`);
                    if (this.specificKeyDownListeners.hasOwnProperty(key)) {
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = this.specificKeyDownListeners[key][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var listener = _step.value;

                                listener(key);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = this.keyDownListeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _listener = _step2.value;

                            _listener(key);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                } else if (!currState && prevState) {
                    if (this.specificKeyUpListeners.hasOwnProperty(key)) {
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = this.specificKeyUpListeners[key][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _listener2 = _step3.value;

                                _listener2(key);
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }

                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = this.keyUpListeners[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _listener3 = _step4.value;

                            _listener3(key);
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }
                }
            }
        }
    },

    lateUpdate: function lateUpdate() {
        for (var key in this.keyStates) {
            if (this.keyStates.hasOwnProperty(key)) {
                this.keyStates[key][1] = !!this.keyStates[key][0];
            }
        }
    },

    // NOTE(istarnion): Index 0 is current, 1 is previous
    // This allows us to see what has changed from frame to frame
    keyStates: {
        space: [false, false],
        enter: [false, false],
        up: [false, false],
        down: [false, false],
        left: [false, false],
        right: [false, false],
        q: [false, false],
        e: [false, false],
        one: [false, false],
        two: [false, false],
        three: [false, false]
    }
};

var getKeyNameFromCode = function getKeyNameFromCode(code) {
    var key = false;
    switch (code) {
        case "Space":
            key = "space";break;
        case "Enter":
            key = "enter";break;
        case "ArrowUp":
            key = "up";break;
        case "ArrowDown":
            key = "down";break;
        case "ArrowLeft":
            key = "left";break;
        case "ArrowRight":
            key = "right";break;
        case "KeyW":
            key = "up";break;
        case "KeyA":
            key = "left";break;
        case "KeyS":
            key = "down";break;
        case "KeyD":
            key = "right";break;
        case "KeyQ":
            key = "q";break;
        case "KeyE":
            key = "e";break;
        case "Digit1":
            key = "one";break;
        case "Digit2":
            key = "two";break;
        case "Digit3":
            key = "three";break;
        default:
            break;
    }

    return key;
};

window.addEventListener("keydown", function (e) {
    var key = getKeyNameFromCode(e.code);
    if (key) {
        input.keyStates[key][0] = true;
    }
});

window.addEventListener("keyup", function (e) {
    var key = getKeyNameFromCode(e.code);
    if (key) {
        input.keyStates[key][0] = false;
    }
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var maps = exports.maps = [{
    tiles: "res/levels/Map01Tiles.png",
    wire: "res/levels/Map01Wire.png",
    decor: [{
        image: "tutorial",
        x: 595,
        y: 380
    }]
}];

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _graphics = __webpack_require__(0);

var _assets = __webpack_require__(1);

var _input = __webpack_require__(4);

var _game = __webpack_require__(7);

var _maps = __webpack_require__(5);

var _musicManager = __webpack_require__(19);

(0, _graphics.setGameSize)(800, 600);

_graphics.gfx.fillText("Loading...", _graphics.gfx.width / 2, _graphics.gfx.height / 2);

var prevTime = performance.now();

var game = null;

var init = function init() {
    game = new _game.Game();
    game.init();
    _musicManager.musicManager.beginLevel();
};

var update = function update() {
    (0, _graphics.clear)();
    var now = performance.now();
    var deltaTime = (now - prevTime) / 1000.0;
    prevTime = now;

    _input.input.update();
    _musicManager.musicManager.update(deltaTime);

    game.updateAndRender(deltaTime);

    window.requestAnimationFrame(update);

    _input.input.lateUpdate();
};

var imagesToLoad = [];
for (var img in _assets.images) {
    if (_assets.images.hasOwnProperty(img)) {
        imagesToLoad.push([img, _assets.images[img]]);
    }
}

for (var i = 0; i < _maps.maps.length; ++i) {
    var name = "level" + i + "_";
    imagesToLoad.push([name + "tiles", _maps.maps[i].tiles]);

    if (_maps.maps[i].hasOwnProperty("wire")) {
        imagesToLoad.push([name + "wire", _maps.maps[i].wire]);
    }
}

(0, _graphics.loadImages)(imagesToLoad).then(function () {
    init();
    update(); // This starts the update loop
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Game = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphics = __webpack_require__(0);

var _input = __webpack_require__(4);

var _tiles = __webpack_require__(8);

var _maps = __webpack_require__(5);

var _powerblock = __webpack_require__(9);

var _wire = __webpack_require__(10);

var _door = __webpack_require__(11);

var _block = __webpack_require__(12);

var _goal = __webpack_require__(13);

var _emitter = __webpack_require__(14);

var _laserbeam = __webpack_require__(15);

var _mirror = __webpack_require__(16);

var _robot = __webpack_require__(17);

var _utils = __webpack_require__(2);

var _cursor = __webpack_require__(18);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = exports.Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.currentLevel = 0;this.level = {};
        this.width = 22;
        this.height = 18;

        this.objects = [];
        this.emitter = null;
        this.goal = null;
        this.decor = [];

        this.powerBot = new _robot.Robot(_robot.RobotTypes.power);
        this.magnetBot = new _robot.Robot(_robot.RobotTypes.magnet);
        this.mirrorBot = new _robot.Robot(_robot.RobotTypes.mirror);

        this.activeBot = this.powerBot;
        this.activeBot.active = true;

        this.state = "fadingIn";
        this.fadeLevel = 1.0;

        this.cursor = null;
        this.levelComplete = false;
    }

    _createClass(Game, [{
        key: "init",
        value: function init() {
            this.level = this.loadCurrentLevel();
            this.updateEmitterLaser();
            this.cursor = new _cursor.Cursor(this.activeBot.x, this.activeBot.y);
        }
    }, {
        key: "updateAndRender",
        value: function updateAndRender(delta) {
            if (this.state === "normal") {
                // Check for input, game logic
                if (_input.input.isKeyDown("one")) {
                    if (this.activeBot !== this.powerBot) {
                        this.activeBot.active = false;
                        this.activeBot = this.powerBot;
                        this.activeBot.active = true;
                    }
                } else if (_input.input.isKeyDown("two")) {
                    if (this.activeBot !== this.magnetBot) {
                        this.activeBot.active = false;
                        this.activeBot = this.magnetBot;
                        this.activeBot.active = true;
                    }
                } else if (_input.input.isKeyDown("three")) {
                    if (this.activeBot !== this.mirrorBot) {
                        this.activeBot.active = false;
                        this.activeBot = this.mirrorBot;
                        this.activeBot.active = true;
                    }
                }

                var move = null;
                if (_input.input.isKeyDown("up")) {
                    move = _utils.Directions.up;
                } else if (_input.input.isKeyDown("right")) {
                    move = _utils.Directions.right;
                } else if (_input.input.isKeyDown("left")) {
                    move = _utils.Directions.left;
                } else if (_input.input.isKeyDown("down")) {
                    move = _utils.Directions.down;
                }

                if (move !== null) {
                    this.state = "animating";

                    var targetX = this.activeBot.x;
                    var targetY = this.activeBot.y;
                    if (move === _utils.Directions.up) targetY--;else if (move === _utils.Directions.right) targetX++;else if (move === _utils.Directions.down) targetY++;else if (move === _utils.Directions.left) targetX--;

                    if (!this.canRobotWalkTo(targetX, targetY)) {
                        // U cannot go here!
                        targetX = this.activeBot.x;
                        targetY = this.activeBot.y;
                    }

                    if (move !== this.activeBot.dir || targetX !== this.activeBot.x || targetY !== this.activeBot.y) {

                        this.activeBot.move(move, targetX, targetY);
                        if (this.activeBot === this.powerBot) {
                            this.updatePowerBotActivation(false);
                        }

                        this.updateEmitterLaser();
                    }
                } else {
                    if (_input.input.isKeyJustPressed("e")) {
                        if (this.activeBot === this.powerBot) {
                            this.updatePowerBotActivation(true);
                        } else if (this.activeBot === this.magnetBot) {
                            this.magnetBotPushPull(true);
                            this.updateEmitterLaser();
                        }
                    } else if (_input.input.isKeyJustPressed("q")) {
                        if (this.activeBot === this.magnetBot) {
                            this.magnetBotPushPull(false);
                            this.updateEmitterLaser();
                        }
                    }
                }

                this.cursor.setTarget(this.activeBot.x, this.activeBot.y);
            } else if (this.state === "fadingIn") {
                this.fadeLevel = Math.max(0, this.fadeLevel - delta);
                if (this.fadeLevel === 0) {
                    this.state = "normal";
                }
            } else if (this.state === "fadingOut") {
                this.fadeLevel = Math.min(1, this.fadeLevel + delta);
                if (this.fadeLevel === 1) {
                    this.currentLevel++;
                    if (this.currentLevel >= _maps.maps.length) {
                        // Game complete
                    } else {
                        this.level = this.loadCurrentLevel();
                        this.state = "fadingIn";
                    }
                }
            } else {
                if (!this.activeBot.moving) this.state = "normal";
            }

            this.powerBot.update(delta);
            this.magnetBot.update(delta);
            this.mirrorBot.update(delta);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var obj = _step.value;

                    if (obj.update) {
                        obj.update(delta);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (this.state === "normal" && this.levelComplete) {
                this.state = "fadingOut";
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.decor[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var d = _step2.value;

                    _graphics.gfx.drawImage(_graphics.sprites[d.image], d.x, d.y);
                }

                // Render tiles:
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            for (var y = 0; y < this.height; ++y) {
                for (var x = 0; x < this.width; ++x) {
                    var tile = this.getTileAt(x, y);
                    if (tile.hasOwnProperty("render")) {
                        tile.render(x, y);
                    }
                }
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.objects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _obj = _step3.value;

                    if (!!_obj.earlyRender) {
                        _obj.earlyRender();
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.objects[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _obj2 = _step4.value;

                    if (!!_obj2.render) {
                        _obj2.render();
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            this.powerBot.render();
            this.magnetBot.render();
            this.mirrorBot.render();

            this.cursor.update(delta);
            this.cursor.render();

            _graphics.gfx.fillStyle = "rgba(0, 0, 0, " + this.fadeLevel + ")";
            _graphics.gfx.fillRect(0, 0, _graphics.gfx.width, _graphics.gfx.height);
        }
    }, {
        key: "getTileAt",
        value: function getTileAt(x, y) {
            return this.level[y][x];
        }
    }, {
        key: "canRobotWalkTo",
        value: function canRobotWalkTo(x, y) {
            var blocked = false;
            var targetTile = this.getTileAt(x, y);
            if (!!targetTile && targetTile.solid) {
                blocked = true;
            } else {
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = this.objects[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var obj = _step5.value;

                        if (obj.x === x && obj.y === y && !!obj.solid) {
                            blocked = true;
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                if (!blocked) {
                    var _arr = [this.magnetBot, this.powerBot, this.mirrorBot];

                    for (var _i = 0; _i < _arr.length; _i++) {
                        var r = _arr[_i];
                        if (x === r.x && y === r.y) {
                            blocked = true;
                            break;
                        }
                    }
                }
            }

            return !blocked;
        }
    }, {
        key: "updateEmitterLaser",
        value: function updateEmitterLaser() {
            this.emitter.laserBeams.length = 0;
            var currCoord = { x: this.emitter.x, y: this.emitter.y };
            var currDir = this.emitter.direction;
            while (true) {
                switch (currDir) {
                    case _utils.Directions.up:
                        --currCoord.y;break;
                    case _utils.Directions.right:
                        ++currCoord.x;break;
                    case _utils.Directions.down:
                        ++currCoord.y;break;
                    case _utils.Directions.left:
                        --currCoord.x;break;
                    default:
                        break;
                }

                var ext = "";
                var blocked = false;
                var targetTile = this.getTileAt(currCoord.x, currCoord.y);
                if (!!targetTile && targetTile.solid && targetTile.id !== _tiles.tileIDs.chasm) {
                    blocked = true;
                } else {
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = this.objects[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var obj = _step6.value;

                            if (obj.x === currCoord.x && obj.y === currCoord.y && !!obj.solid) {
                                if (obj instanceof _goal.Goal) {
                                    this.levelComplete = true;
                                    blocked = true;
                                } else if (obj instanceof _mirror.Mirror) {
                                    if (currDir === _utils.Directions.up) {
                                        if (obj.orientation === "sw") {
                                            ext = "_sw";
                                            currDir = _utils.Directions.left;
                                        } else if (obj.orientation === "se") {
                                            ext = "_se";
                                            currDir = _utils.Directions.right;
                                        } else {
                                            blocked = true;
                                        }
                                    } else if (currDir === _utils.Directions.right) {
                                        if (obj.orientation === "sw") {
                                            ext = "_sw";
                                            currDir = _utils.Directions.down;
                                        } else if (obj.orientation === "nw") {
                                            ext = "_nw";
                                            currDir = _utils.Directions.up;
                                        } else {
                                            blocked = true;
                                        }
                                    } else if (currDir === _utils.Directions.down) {
                                        if (obj.orientation === "nw") {
                                            ext = "_nw";
                                            currDir = _utils.Directions.left;
                                        } else if (obj.orientation === "ne") {
                                            ext = "_ne";
                                            currDir = _utils.Directions.right;
                                        } else {
                                            blocked = true;
                                        }
                                    } else if (currDir === _utils.Directions.left) {
                                        if (obj.orientation === "ne") {
                                            ext = "_ne";
                                            currDir = _utils.Directions.up;
                                        } else if (obj.orientation === "se") {
                                            ext = "_se";
                                            currDir = _utils.Directions.down;
                                        } else {
                                            blocked = true;
                                        }
                                    }
                                } else {
                                    blocked = true;
                                }
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError6 = true;
                        _iteratorError6 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                _iterator6.return();
                            }
                        } finally {
                            if (_didIteratorError6) {
                                throw _iteratorError6;
                            }
                        }
                    }

                    if (!blocked) {
                        var _arr2 = [this.magnetBot, this.powerBot, this.mirrorBot];

                        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
                            var r = _arr2[_i2];
                            if (currCoord.x === r.x && currCoord.y === r.y) {
                                if (r === this.mirrorBot) {
                                    if (currDir === _utils.Directions.up) {
                                        if (r.dir === _utils.Directions.down) {
                                            ext = "_sw";
                                            currDir = _utils.Directions.left;
                                        } else if (r.dir === _utils.Directions.right) {
                                            ext = "_se";
                                            currDir = _utils.Directions.right;
                                        } else {
                                            blocked = true;
                                        }
                                    } else if (currDir === _utils.Directions.right) {
                                        if (r.dir === _utils.Directions.down) {
                                            ext = "_sw";
                                            currDir = _utils.Directions.down;
                                        } else if (r.dir === _utils.Directions.left) {
                                            ext = "_nw";
                                            currDir = _utils.Directions.up;
                                        } else {
                                            blocked = true;
                                        }
                                    } else if (currDir === _utils.Directions.down) {
                                        if (r.dir === _utils.Directions.left) {
                                            ext = "_nw";
                                            currDir = _utils.Directions.left;
                                        } else if (r.dir === _utils.Directions.up) {
                                            ext = "_ne";
                                            currDir = _utils.Directions.right;
                                        } else {
                                            blocked = true;
                                        }
                                    } else if (currDir === _utils.Directions.left) {
                                        if (r.dir === _utils.Directions.up) {
                                            ext = "_ne";
                                            currDir = _utils.Directions.up;
                                        } else if (r.dir === _utils.Directions.right) {
                                            ext = "_se";
                                            currDir = _utils.Directions.down;
                                        } else {
                                            blocked = true;
                                        }
                                    }
                                } else {
                                    blocked = true;
                                }
                                break;
                            }
                        }
                    }
                }

                if (blocked) break;else this.emitter.laserBeams.push(new _laserbeam.LaserBeam(currCoord.x, currCoord.y, currDir, ext));
            }
        }
    }, {
        key: "updatePowerBotActivation",
        value: function updatePowerBotActivation(isOn) {
            var targetX = this.activeBot.x;
            var targetY = this.activeBot.y;
            if (this.activeBot.dir === _utils.Directions.up) --targetY;else if (this.activeBot.dir === _utils.Directions.right) ++targetX;else if (this.activeBot.dir === _utils.Directions.down) ++targetY;else if (this.activeBot.dir === _utils.Directions.left) --targetX;

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this.objects[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var obj = _step7.value;

                    if (!!obj.setPowerState) {
                        if (obj.x === targetX && obj.y === targetY) {
                            obj.setPowerState(isOn);
                        } else {
                            obj.setPowerState(false);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }
        }
    }, {
        key: "magnetBotPushPull",
        value: function magnetBotPushPull(push) {
            var dx = 0;
            var dy = 0;
            switch (this.magnetBot.dir) {
                case _utils.Directions.up:
                    --dy;break;
                case _utils.Directions.right:
                    ++dx;break;
                case _utils.Directions.down:
                    ++dy;break;
                case _utils.Directions.left:
                    --dx;break;
            }

            var currCoord = { x: this.magnetBot.x, y: this.magnetBot.y };
            while (true) {
                currCoord.x += dx;
                currCoord.y += dy;

                var targetTile = this.getTileAt(currCoord.x, currCoord.y);
                if (!!targetTile && targetTile.solid) {
                    // Can't move solid tiles
                    return;
                }

                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = this.objects[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var obj = _step8.value;

                        if (obj.x === currCoord.x && obj.y === currCoord.y) {
                            if (obj instanceof _block.Block || obj instanceof _mirror.Mirror) {

                                var targetX = currCoord.x + dx * (push ? 1 : -1);
                                var targetY = currCoord.y + dy * (push ? 1 : -1);

                                if (this.canRobotWalkTo(targetX, targetY)) {
                                    obj.x = targetX;
                                    obj.y = targetY;
                                } else if (obj instanceof _block.Block && this.getTileAt(targetX, targetY).id === _tiles.tileIDs.chasm) {
                                    this.level[targetY][targetX] = (0, _tiles.createTile)(_tiles.tileIDs.fallenBlock);
                                    this.level[targetY][targetX].sprite = obj.sprite;
                                    (0, _utils.removeFromArray)(this.objects, obj);
                                }

                                return;
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }
            }
        }
    }, {
        key: "loadCurrentLevel",
        value: function loadCurrentLevel() {
            var levelName = "level" + this.currentLevel;
            this.levelComplete = false;
            this.decor = _maps.maps[this.currentLevel].decor;
            return this.loadLevel(levelName);
        }
    }, {
        key: "loadLevel",
        value: function loadLevel(name) {
            var _this = this;

            var tiles = (0, _graphics.getBitmap)(name + "_tiles");
            var wires = (0, _graphics.getBitmap)(name + "_wire");
            var map = [];

            for (var y = 0; y < tiles.height; ++y) {
                map.push([]);
                for (var x = 0; x < tiles.width; ++x) {
                    var color = tiles.getPixel(x, y);
                    var tileID = (0, _tiles.colorToTileID)(color);
                    map[y].push((0, _tiles.createTile)(tileID));

                    // Check for robot
                    if (tileID === _tiles.tileIDs.floor) {
                        var hex = color.r << 16 | color.g << 8 | color.b << 0;

                        if (hex === 0xFFFFFF) continue;

                        switch (hex) {
                            case 0xFF0000:
                                this.mirrorBot.setPosition(x, y);
                                break;
                            case 0x00FFFF:
                                this.powerBot.setPosition(x, y);
                                break;
                            case 0xB200FF:
                                this.magnetBot.setPosition(x, y);
                                break;
                            case 0x7F0000:
                                this.objects.push(new _block.Block(x, y));
                                break;
                            case 0xFFD800:
                                this.emitter = new _emitter.Emitter(x, y);
                                this.objects.push(this.emitter);
                                break;
                            case 0xFF6A00:
                                // Memory (up)
                                break;
                            case 0x57007F:
                                this.objects.push(new _mirror.Mirror(x, y, "sw"));
                                break;
                            case 0x7F6A00:
                                this.objects.push(new _mirror.Mirror(x, y, "se"));
                                break;
                            case 0x00FF21:
                                // Goal
                                this.goal = new _goal.Goal(x, y);
                                this.objects.push(this.goal);
                                break;
                            default:
                                console.warn(hex.toString(16));
                                console.warn("Bug in level loading robot logic");
                                break;
                        }
                    }
                }
            }

            // NOTE(istarnion): I'm sorry for this code. :(
            // I wont be able to read it myself tomorrow, but it seems to
            // work for now
            for (var _y2 = 0; _y2 < wires.height; ++_y2) {
                for (var _x2 = 0; _x2 < wires.width; ++_x2) {
                    var _tileID = (0, _tiles.colorToTileID)(wires.getPixel(_x2, _y2));
                    if (_tileID === _tiles.tileIDs.powerblock) {
                        (function () {
                            var powerblock = new _powerblock.Powerblock(_x2, _y2);
                            _this.objects.push(powerblock);

                            var openList = [];
                            var closedList = [];
                            var getNeighbour = function getNeighbour(_x, _y) {
                                if (closedList.indexOf(_x + _y * wires.width) >= 0) return false;

                                var color = wires.getPixel(_x, _y);
                                if (!color) return;

                                var id = (0, _tiles.colorToTileID)(color);
                                if (!id) return;

                                if (id === _tiles.tileIDs.wire) {
                                    var wire = new _wire.Wire(_x, _y);
                                    powerblock.wires.push(wire);
                                    _this.objects.push(wire);
                                    openList.push({ x: _x, y: _y });
                                } else if (id === _tiles.tileIDs.door) {
                                    var isHorizontal = false;
                                    var tileAbove = map[_y - 1][_x];
                                    if (!!tileAbove && tileAbove.solid) isHorizontal = true;
                                    var door = new _door.Door(_x, _y, isHorizontal);
                                    powerblock.doors.push(door);
                                    _this.objects.push(door);
                                    openList.push({ x: _x, y: _y });
                                }
                            };

                            var visitNeighbours = function visitNeighbours(coord) {
                                getNeighbour(coord.x, coord.y - 1);
                                getNeighbour(coord.x - 1, coord.y);
                                getNeighbour(coord.x + 1, coord.y);
                                getNeighbour(coord.x, coord.y + 1);
                            };

                            var currCoord = { x: _x2, y: _y2 };
                            openList.push(currCoord);

                            do {
                                currCoord = openList.pop();
                                closedList.push(currCoord.x + currCoord.y * wires.width);

                                visitNeighbours(currCoord);
                            } while (openList.length > 0);

                            powerblock.initWires();
                        })();
                    }
                }
            }

            return map;
        }
    }]);

    return Game;
}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderTile = exports.createTile = exports.colorToTileID = exports.tiles = exports.tileIDs = undefined;

var _graphics = __webpack_require__(0);

// NOTE(istarnion): These values must match the indices in the tiles array.
// This is bad, but I'm too sleepy to figure out a cleaner solution
var tileIDs = exports.tileIDs = {
    floor: 0,
    wall: 1,
    chasm: 2,
    fallenBlock: 3,
    powerblock: 10,
    wire: 11,
    door: 12,
    emitter: 13
};

var tiles = exports.tiles = [{
    id: tileIDs.floor,
    solid: false,
    sprite: "floor1",

    render: function render(x, y) {
        renderTile(_graphics.sprites[this.sprite], x, y);
    }
}, {
    id: tileIDs.wall,
    solid: true,
    sprite: "wall1",

    render: function render(x, y) {
        renderTile(_graphics.sprites[this.sprite], x, y);
    }
}, {
    id: tileIDs.chasm,
    solid: true,
    sprite: "chasm",

    render: function render(x, y) {
        renderTile(_graphics.sprites[this.sprite], x, y);
    }
}, {
    id: tileIDs.falledBlock,
    solid: false,
    numFramesRemainingOnMidFrame: 10,

    render: function render(x, y) {
        // this.sprite is set outside
        if (this.numFramesRemainingOnMidFrame > 0) {
            --this.numFramesRemainingOnMidFrame;
            this.sprite.currentFrame = 1;
        } else {
            this.sprite.currentFrame = 2;
        }

        this.sprite.draw(x, y);
    }
}];

var colorToTileID = exports.colorToTileID = function colorToTileID(color) {
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
    var hex = color.r << 16 | color.g << 8 | color.b << 0;

    switch (hex) {
        // Robots have floors under them! Blocks too!
        case 0xFF0000:
        case 0x00FFFF:
        case 0xB200FF:
        case 0x7F0000:
        case 0x57007F:
        case 0x7F6A00:
        case 0xFFD800:
        case 0x00FF21:
        case 0xFF6A00:
        case 0xFFFFFF:
            return tileIDs.floor;

        case 0x0026FF:
            return tileIDs.wall;

        case 0x808080:
            return tileIDs.powerblock;
        case 0xFF7F7F:
            return tileIDs.wire;
        case 0x267F00:
            return tileIDs.door;

        case 0x000000:
            return tileIDs.chasm;

            defualt: console.warn("We don't support color 0x" + hex.toString(16).toUpperCase() + " (yet?)");
            break;
    }
};

var createTile = exports.createTile = function createTile(tile) {
    var result = {};
    var tileData = tiles[tile];

    for (var prop in tileData) {
        if (tileData.hasOwnProperty(prop)) {
            result[prop] = tileData[prop];
        }
    }

    return result;
};

var renderTile = exports.renderTile = function renderTile(colorOrImage, x, y) {
    (0, _graphics.drawSprite)(colorOrImage, x, y);

    // For debug:
    //gfx.strokeStyle = "red";
    //gfx.strokeRect(48+x*32, 12+y*32, 32, 32);
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Powerblock = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assets = __webpack_require__(1);

var _animation = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Powerblock = exports.Powerblock = function () {
    function Powerblock(x, y) {
        _classCallCheck(this, Powerblock);

        this.x = x;
        this.y = y;
        this.solid = true;
        this.wires = [];
        this.doors = [];
        this.isPowered = false;

        this.sprite = new _animation.Animation(_assets.animations.powerBlock);
    }

    _createClass(Powerblock, [{
        key: "setPowerState",
        value: function setPowerState(p) {
            if (p === this.isPowered) return;

            this.isPowered = p;

            this.sprite.currentFrame = p ? 1 : 0;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.wires[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var wire = _step.value;

                    wire.powered = p;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.doors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var door = _step2.value;

                    door.open = p;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            this.sprite.draw(this.x, this.y);
        }
    }, {
        key: "initWires",
        value: function initWires() {
            var o = 0;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.wires[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var wire = _step3.value;

                    o = 0;
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = this.wires[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var otherWire = _step4.value;

                            if (wire !== otherWire) {
                                if (wire.y - otherWire.y === 1 && wire.x === otherWire.x) {
                                    // above
                                    o |= 1;
                                } else if (wire.x - otherWire.x === 1 && wire.y === otherWire.y) {
                                    // Left
                                    o |= 2;
                                }
                                if (wire.y - otherWire.y === -1 && wire.x === otherWire.x) {
                                    // Below
                                    o |= 4;
                                } else if (wire.x - otherWire.x === -1 && wire.y === otherWire.y) {
                                    // Right
                                    o |= 8;
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }

                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = this.doors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var door = _step5.value;

                            if (wire.y - door.y === 1 && wire.x === door.x) {
                                // above
                                o |= 1;
                            } else if (wire.x - door.x === 1 && wire.y === door.y) {
                                // Left
                                o |= 2;
                            }
                            if (wire.y - door.y === -1 && wire.x === door.x) {
                                // Below
                                o |= 4;
                            } else if (wire.x - door.x === -1 && wire.y === door.y) {
                                // Right
                                o |= 8;
                            }
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }

                    if (wire.y - this.y === 1 && wire.x === this.x) {
                        // above
                        o |= 1;
                    } else if (wire.x - this.x === 1 && wire.y === this.y) {
                        // Left
                        o |= 2;
                    }
                    if (wire.y - this.y === -1 && wire.x === this.x) {
                        // Below
                        o |= 4;
                    } else if (wire.x - this.x === -1 && wire.y === this.y) {
                        // Right
                        o |= 8;
                    }

                    if (o === 5) wire.orientation = "v";else if (o === 10) wire.orientation = "h";else if (o === 12) wire.orientation = "se";else if (o === 6) wire.orientation = "sw";else if (o === 9) wire.orientation = "ne";else if (o === 3) wire.orientation = "nw";
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: "powered",
        get: function get() {
            return this.isPowered;
        }
    }]);

    return Powerblock;
}();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Wire = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphics = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wire = exports.Wire = function () {
    function Wire(x, y) {
        _classCallCheck(this, Wire);

        this.x = x;
        this.y = y;
        this.solid = false;
        this.isPowered = false;

        this.currentSprite = "#440000";
        this.sprite = null;
        this.o = "";
    }

    _createClass(Wire, [{
        key: "earlyRender",
        value: function earlyRender() {
            if (!!this.sprite) {
                (0, _graphics.drawSprite)(this.sprite, this.x, this.y);
            }
        }
    }, {
        key: "orientation",
        set: function set(o) {
            this.o = o;
            this.sprite = _graphics.sprites["wire_" + o];
        }
    }, {
        key: "powered",
        set: function set(p) {
            this.isPowered = p;
            if (p) {
                this.sprite = _graphics.sprites["wire_powered_" + this.o];
            } else {
                this.sprite = _graphics.sprites["wire_" + this.o];
            }
        },
        get: function get() {
            return this.isPowered;
        }
    }]);

    return Wire;
}();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Door = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assets = __webpack_require__(1);

var _animation = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Door = exports.Door = function () {
    function Door(x, y, isHorizontal) {
        _classCallCheck(this, Door);

        this.x = x;
        this.y = y;
        this.solid = true;
        this.isOpen = false;

        var animName = isHorizontal ? "horizontalDoor" : "verticalDoor";
        this.openAnim = new _animation.Animation(_assets.animations[animName + "Open"]);
        this.closeAnim = new _animation.Animation(_assets.animations[animName + "Close"]);
        this.sprite = this.closeAnim;
    }

    _createClass(Door, [{
        key: "update",
        value: function update(delta) {
            this.sprite.update(delta);
        }
    }, {
        key: "render",
        value: function render() {
            this.sprite.draw(this.x, this.y);
        }
    }, {
        key: "open",
        set: function set(o) {
            this.isOpen = o;
            this.solid = !o;
            this.sprite = o ? this.openAnim : this.closeAnim;
            this.sprite.reset();
        },
        get: function get() {
            return this.isOpen;
        }
    }]);

    return Door;
}();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Block = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphics = __webpack_require__(0);

var _assets = __webpack_require__(1);

var _animation = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Block = exports.Block = function () {
    function Block(x, y) {
        _classCallCheck(this, Block);

        this.x = x;
        this.y = y;
        this.solid = true;

        this.sprite = new _animation.Animation(_assets.animations.block);
    }

    _createClass(Block, [{
        key: "render",
        value: function render() {
            this.sprite.draw(this.x, this.y);
        }
    }]);

    return Block;
}();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Goal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assets = __webpack_require__(1);

var _animation = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Goal = exports.Goal = function () {
    function Goal(x, y) {
        _classCallCheck(this, Goal);

        this.x = x;
        this.y = y;
        this.solid = true;

        this.sprite = new _animation.Animation(_assets.animations.goal);
    }

    _createClass(Goal, [{
        key: "update",
        value: function update(delta) {
            this.sprite.update(delta);
        }
    }, {
        key: "render",
        value: function render() {
            this.sprite.draw(this.x, this.y);
        }
    }]);

    return Goal;
}();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Emitter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assets = __webpack_require__(1);

var _animation = __webpack_require__(3);

var _utils = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Emitter = exports.Emitter = function () {
    function Emitter(x, y) {
        _classCallCheck(this, Emitter);

        this.x = x;
        this.y = y;
        this.solid = true;

        this.sprite = new _animation.Animation(_assets.animations.emitter);

        this.laserBeams = [];

        this.direction = _utils.Directions.up;
    }

    _createClass(Emitter, [{
        key: "update",
        value: function update(delta) {
            this.sprite.update(delta);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.laserBeams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var beam = _step.value;

                    beam.update(delta);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            this.sprite.draw(this.x, this.y, 0, 0, this.direction);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.laserBeams[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var beam = _step2.value;

                    beam.render();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }]);

    return Emitter;
}();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LaserBeam = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assets = __webpack_require__(1);

var _animation = __webpack_require__(3);

var _utils = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LaserBeam = exports.LaserBeam = function () {
    function LaserBeam(x, y, dir, ext) {
        _classCallCheck(this, LaserBeam);

        this.x = x;
        this.y = y;

        if (ext.length > 0) {
            this.direction = _utils.Directions.up;
        } else {
            this.direction = dir;
        }

        this.sprite = new _animation.Animation(_assets.animations["laser" + ext]);
    }

    _createClass(LaserBeam, [{
        key: "update",
        value: function update(delta) {
            this.sprite.update(delta);
        }
    }, {
        key: "render",
        value: function render() {
            this.sprite.draw(this.x, this.y, 0, 0, this.direction);
        }
    }]);

    return LaserBeam;
}();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Mirror = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphics = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mirror = exports.Mirror = function () {
    function Mirror(x, y, orientation) {
        _classCallCheck(this, Mirror);

        this.x = x;
        this.y = y;
        this.solid = true;
        this.isMirror = true;
        this.orientation = orientation;

        this.sprite = _graphics.sprites["mirror_" + orientation];
    }

    _createClass(Mirror, [{
        key: "render",
        value: function render() {
            (0, _graphics.drawSprite)(this.sprite, this.x, this.y);
        }
    }]);

    return Mirror;
}();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Robot = exports.RobotTypes = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphics = __webpack_require__(0);

var _assets = __webpack_require__(1);

var _animation = __webpack_require__(3);

var _utils = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RobotTypes = exports.RobotTypes = {
    power: 0,
    magnet: 1, mirror: 2
};

var Robot = exports.Robot = function () {
    function Robot(type) {
        _classCallCheck(this, Robot);

        this.type = type;

        switch (type) {
            case RobotTypes.power:
                this.animDown = new _animation.Animation(_assets.animations.powerBotDown);
                this.animIdle = new _animation.Animation(_assets.animations.powerBotIdle);
                this.animWalk = new _animation.Animation(_assets.animations.powerBotWalk);
                break;
            case RobotTypes.magnet:
                this.animDown = new _animation.Animation(_assets.animations.magnetBotDown);
                this.animIdle = new _animation.Animation(_assets.animations.magnetBotIdle);
                this.animWalk = new _animation.Animation(_assets.animations.magnetBotWalk);
                break;
            case RobotTypes.mirror:
                this.animDown = new _animation.Animation(_assets.animations.mirrorBotDown);
                this.animIdle = new _animation.Animation(_assets.animations.mirrorBotIdle);
                this.animWalk = new _animation.Animation(_assets.animations.mirrorBotWalk);
                break;
            default:
                console.warn("Buggy creation of robots!");
        }

        this.currAnim = this.animDown;

        this.x = 0;
        this.y = 0;

        this.dir = _utils.Directions.up;
        this.moving = false;
        this.moveTime = 0;

        this.offsetX = 0;
        this.offsetY = 0;
        this.deltaX = 0;
        this.deltaY = 0;

        this.speed = 160;
    }

    _createClass(Robot, [{
        key: "setPosition",
        value: function setPosition(x, y) {
            this.x = x;
            this.y = y;
        }
    }, {
        key: "move",
        value: function move(direction, x, y) {
            this.moving = true;
            if (direction !== this.dir) {
                this.moveTime = 0.2;
                this.dir = direction;
            } else {
                this.currAnim = this.animWalk;
                if (this.x < x) {
                    this.offsetX = -32;
                    this.deltaX = this.speed;
                } else if (this.x > x) {
                    this.offsetX = 32;
                    this.deltaX = -this.speed;
                } else if (this.y < y) {
                    this.offsetY = -32;
                    this.deltaY = this.speed;
                } else if (this.y > y) {
                    this.offsetY = 32;
                    this.deltaY = -this.speed;
                }

                this.x = x;
                this.y = y;
            }
        }
    }, {
        key: "render",
        value: function render() {
            this.currAnim.draw(this.x, this.y, this.offsetX, this.offsetY, this.dir);
        }
    }, {
        key: "update",
        value: function update(deltaTime) {
            this.currAnim.update(deltaTime);

            if (this.moving) {
                this.moveTime = Math.max(0, this.moveTime - deltaTime);

                this.offsetX += this.deltaX * deltaTime;
                this.offsetY += this.deltaY * deltaTime;

                if (Math.abs(this.offsetX) < 1) this.offsetX = 0;
                if (Math.abs(this.offsetY) < 1) this.offsetY = 0;

                if (this.moveTime === 0 && this.offsetX === 0 && this.offsetY === 0) {
                    this.currAnim = this.animIdle;
                    this.deltaX = this.deltaY = 0;
                    this.moving = false;
                }
            }
        }
    }, {
        key: "active",
        set: function set(a) {
            if (a) this.currAnim = this.animIdle;else this.currAnim = this.animDown;
            this.currAnim.reset();
        }
    }]);

    return Robot;
}();

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Cursor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphics = __webpack_require__(0);

var _utils = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;

var Cursor = exports.Cursor = function () {
    function Cursor(x, y) {
        _classCallCheck(this, Cursor);

        this.targetX = x;
        this.targetY = y;
        this.offsetX = 0;
        this.offsetY = 0;

        this.speed = 2048;
        this.bounceSpeed = 6;
        this.theta = 0;

        this.sprite = _graphics.sprites["cursor"];
    }

    _createClass(Cursor, [{
        key: "setTarget",
        value: function setTarget(x, y) {
            if (x !== this.targetX || y !== this.targetY) {
                this.offsetX = (this.targetX - x) * 32;
                this.offsetY = (this.targetY - y) * 32;
                this.targetX = x;
                this.targetY = y;
            }
        }
    }, {
        key: "update",
        value: function update(delta) {
            this.theta += this.bounceSpeed * delta;
            if (this.theta > 2 * Math.PI) {
                this.theta -= 2 * Math.PI;
            }

            var dx = -this.offsetX;
            var dy = -this.offsetY;
            var len = Math.sqrt(dx * dx + dy * dy);
            if (Math.abs(len) > this.speed * delta) {
                this.offsetX += dx / len * this.speed * delta;
                this.offsetY += dy / len * this.speed * delta;
            } else {
                this.offsetX = this.offsetY = 0;
            }
        }
    }, {
        key: "render",
        value: function render() {
            var radius = 16 + Math.sin(this.theta) * 4;

            (0, _graphics.drawSprite)(this.sprite, this.targetX, this.targetY, this.offsetX - radius, this.offsetY - radius, _utils.Directions.up);
            (0, _graphics.drawSprite)(this.sprite, this.targetX, this.targetY, this.offsetX + radius, this.offsetY - radius, _utils.Directions.right);
            (0, _graphics.drawSprite)(this.sprite, this.targetX, this.targetY, this.offsetX + radius, this.offsetY + radius, _utils.Directions.down);
            (0, _graphics.drawSprite)(this.sprite, this.targetX, this.targetY, this.offsetX - radius, this.offsetY + radius, _utils.Directions.left);
        }
    }]);

    return Cursor;
}();

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.musicManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _howlerMin = __webpack_require__(20);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MusicManager = function () {
    function MusicManager() {
        var _this = this;

        _classCallCheck(this, MusicManager);

        this.timeToPlayAmbientsound = 10;
        // Load sounds
        this.sounds = {};
        this.sounds.echo = new _howlerMin.Howl({
            src: ['/res/sounds/SFXEcho.mp3']
        });
        this.sounds.blockDrag = new _howlerMin.Howl({
            src: ['/res/sounds/SFXBlockDrag.mp3']
        });
        // Load music
        this.music = {};
        this.music.startDrone = new _howlerMin.Howl({
            src: ['/res/sounds/BassDrone_Start.mp3'],
            onend: function onend() {
                _this.music.loopDrone.play();
            }
        });
        this.music.loopDrone = new _howlerMin.Howl({
            src: ['/res/sounds/BassDrone_Cont.mp3'],
            loop: true
        });

        // Load ambientSounds
        this.ambientSounds = [];
        this.ambientSounds.push(new _howlerMin.Howl({ src: ['res/sounds/ambience_01.ogg'] }), new _howlerMin.Howl({ src: ['res/sounds/ambience_02.ogg'] }), new _howlerMin.Howl({ src: ['res/sounds/ambience_03.ogg'] }), new _howlerMin.Howl({ src: ['res/sounds/ambience_04.ogg'] }), new _howlerMin.Howl({ src: ['res/sounds/ambience_05.ogg'] }), new _howlerMin.Howl({ src: ['res/sounds/ambience_06.ogg'] }), new _howlerMin.Howl({ src: ['res/sounds/ambience_07.ogg'] }), new _howlerMin.Howl({ src: ['res/sounds/ambience_08.ogg'] }), new _howlerMin.Howl({ src: ['res/sounds/ambience_09.ogg'] }), new _howlerMin.Howl({ src: ['res/sounds/ambience_10.ogg'] }));
    }

    _createClass(MusicManager, [{
        key: 'update',
        value: function update(deltaTime) {
            this.timeToPlayAmbientsound -= deltaTime;
            if (this.timeToPlayAmbientsound <= 0) {
                this.timeToPlayAmbientsound = 7 + Math.random() * 15 - 7;
                this.playAmbient(Math.floor(Math.random() * 10));
            }
        }
    }, {
        key: 'startMusic',
        value: function startMusic() {}
    }, {
        key: 'playSound',
        value: function playSound(action) {
            this.sounds[action].play();
        }
    }, {
        key: 'beginLevel',
        value: function beginLevel() {
            // fade inn?
            this.music.startDrone.play();
        }
    }, {
        key: 'endLevel',
        value: function endLevel() {
            // fade out...
        }
    }, {
        key: 'playAmbient',
        value: function playAmbient(index) {
            this.ambientSounds[index].play();
        }
    }]);

    return MusicManager;
}();

var musicManager = exports.musicManager = new MusicManager();

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! howler.js v2.0.7 | (c) 2013-2017, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
!function () {
  "use strict";
  var e = function e() {
    this.init();
  };e.prototype = { init: function init() {
      var e = this || n;return e._counter = 1e3, e._codecs = {}, e._howls = [], e._muted = !1, e._volume = 1, e._canPlayEvent = "canplaythrough", e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null, e.masterGain = null, e.noAudio = !1, e.usingWebAudio = !0, e.autoSuspend = !0, e.ctx = null, e.mobileAutoEnable = !0, e._setup(), e;
    }, volume: function volume(e) {
      var o = this || n;if (e = parseFloat(e), o.ctx || _(), void 0 !== e && e >= 0 && e <= 1) {
        if (o._volume = e, o._muted) return o;o.usingWebAudio && o.masterGain.gain.setValueAtTime(e, n.ctx.currentTime);for (var t = 0; t < o._howls.length; t++) {
          if (!o._howls[t]._webAudio) for (var r = o._howls[t]._getSoundIds(), a = 0; a < r.length; a++) {
            var u = o._howls[t]._soundById(r[a]);u && u._node && (u._node.volume = u._volume * e);
          }
        }return o;
      }return o._volume;
    }, mute: function mute(e) {
      var o = this || n;o.ctx || _(), o._muted = e, o.usingWebAudio && o.masterGain.gain.setValueAtTime(e ? 0 : o._volume, n.ctx.currentTime);for (var t = 0; t < o._howls.length; t++) {
        if (!o._howls[t]._webAudio) for (var r = o._howls[t]._getSoundIds(), a = 0; a < r.length; a++) {
          var u = o._howls[t]._soundById(r[a]);u && u._node && (u._node.muted = !!e || u._muted);
        }
      }return o;
    }, unload: function unload() {
      for (var e = this || n, o = e._howls.length - 1; o >= 0; o--) {
        e._howls[o].unload();
      }return e.usingWebAudio && e.ctx && void 0 !== e.ctx.close && (e.ctx.close(), e.ctx = null, _()), e;
    }, codecs: function codecs(e) {
      return (this || n)._codecs[e.replace(/^x-/, "")];
    }, _setup: function _setup() {
      var e = this || n;if (e.state = e.ctx ? e.ctx.state || "running" : "running", e._autoSuspend(), !e.usingWebAudio) if ("undefined" != typeof Audio) try {
        var o = new Audio();void 0 === o.oncanplaythrough && (e._canPlayEvent = "canplay");
      } catch (n) {
        e.noAudio = !0;
      } else e.noAudio = !0;try {
        var o = new Audio();o.muted && (e.noAudio = !0);
      } catch (e) {}return e.noAudio || e._setupCodecs(), e;
    }, _setupCodecs: function _setupCodecs() {
      var e = this || n,
          o = null;try {
        o = "undefined" != typeof Audio ? new Audio() : null;
      } catch (n) {
        return e;
      }if (!o || "function" != typeof o.canPlayType) return e;var t = o.canPlayType("audio/mpeg;").replace(/^no$/, ""),
          r = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g),
          a = r && parseInt(r[0].split("/")[1], 10) < 33;return e._codecs = { mp3: !(a || !t && !o.canPlayType("audio/mp3;").replace(/^no$/, "")), mpeg: !!t, opus: !!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""), ogg: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), oga: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), wav: !!o.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), aac: !!o.canPlayType("audio/aac;").replace(/^no$/, ""), caf: !!o.canPlayType("audio/x-caf;").replace(/^no$/, ""), m4a: !!(o.canPlayType("audio/x-m4a;") || o.canPlayType("audio/m4a;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""), mp4: !!(o.canPlayType("audio/x-mp4;") || o.canPlayType("audio/mp4;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""), weba: !!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""), webm: !!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""), dolby: !!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""), flac: !!(o.canPlayType("audio/x-flac;") || o.canPlayType("audio/flac;")).replace(/^no$/, "") }, e;
    }, _enableMobileAudio: function _enableMobileAudio() {
      var e = this || n,
          o = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator && e._navigator.userAgent),
          t = !!("ontouchend" in window || e._navigator && e._navigator.maxTouchPoints > 0 || e._navigator && e._navigator.msMaxTouchPoints > 0);if (!e._mobileEnabled && e.ctx && (o || t)) {
        e._mobileEnabled = !1, e._mobileUnloaded || 44100 === e.ctx.sampleRate || (e._mobileUnloaded = !0, e.unload()), e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050);var r = function r() {
          n._autoResume();var o = e.ctx.createBufferSource();o.buffer = e._scratchBuffer, o.connect(e.ctx.destination), void 0 === o.start ? o.noteOn(0) : o.start(0), "function" == typeof e.ctx.resume && e.ctx.resume(), o.onended = function () {
            o.disconnect(0), e._mobileEnabled = !0, e.mobileAutoEnable = !1, document.removeEventListener("touchstart", r, !0), document.removeEventListener("touchend", r, !0);
          };
        };return document.addEventListener("touchstart", r, !0), document.addEventListener("touchend", r, !0), e;
      }
    }, _autoSuspend: function _autoSuspend() {
      var e = this;if (e.autoSuspend && e.ctx && void 0 !== e.ctx.suspend && n.usingWebAudio) {
        for (var o = 0; o < e._howls.length; o++) {
          if (e._howls[o]._webAudio) for (var t = 0; t < e._howls[o]._sounds.length; t++) {
            if (!e._howls[o]._sounds[t]._paused) return e;
          }
        }return e._suspendTimer && clearTimeout(e._suspendTimer), e._suspendTimer = setTimeout(function () {
          e.autoSuspend && (e._suspendTimer = null, e.state = "suspending", e.ctx.suspend().then(function () {
            e.state = "suspended", e._resumeAfterSuspend && (delete e._resumeAfterSuspend, e._autoResume());
          }));
        }, 3e4), e;
      }
    }, _autoResume: function _autoResume() {
      var e = this;if (e.ctx && void 0 !== e.ctx.resume && n.usingWebAudio) return "running" === e.state && e._suspendTimer ? (clearTimeout(e._suspendTimer), e._suspendTimer = null) : "suspended" === e.state ? (e.ctx.resume().then(function () {
        e.state = "running";for (var n = 0; n < e._howls.length; n++) {
          e._howls[n]._emit("resume");
        }
      }), e._suspendTimer && (clearTimeout(e._suspendTimer), e._suspendTimer = null)) : "suspending" === e.state && (e._resumeAfterSuspend = !0), e;
    } };var n = new e(),
      o = function o(e) {
    var n = this;if (!e.src || 0 === e.src.length) return void console.error("An array of source files must be passed with any new Howl.");n.init(e);
  };o.prototype = { init: function init(e) {
      var o = this;return n.ctx || _(), o._autoplay = e.autoplay || !1, o._format = "string" != typeof e.format ? e.format : [e.format], o._html5 = e.html5 || !1, o._muted = e.mute || !1, o._loop = e.loop || !1, o._pool = e.pool || 5, o._preload = "boolean" != typeof e.preload || e.preload, o._rate = e.rate || 1, o._sprite = e.sprite || {}, o._src = "string" != typeof e.src ? e.src : [e.src], o._volume = void 0 !== e.volume ? e.volume : 1, o._xhrWithCredentials = e.xhrWithCredentials || !1, o._duration = 0, o._state = "unloaded", o._sounds = [], o._endTimers = {}, o._queue = [], o._playLock = !1, o._onend = e.onend ? [{ fn: e.onend }] : [], o._onfade = e.onfade ? [{ fn: e.onfade }] : [], o._onload = e.onload ? [{ fn: e.onload }] : [], o._onloaderror = e.onloaderror ? [{ fn: e.onloaderror }] : [], o._onplayerror = e.onplayerror ? [{ fn: e.onplayerror }] : [], o._onpause = e.onpause ? [{ fn: e.onpause }] : [], o._onplay = e.onplay ? [{ fn: e.onplay }] : [], o._onstop = e.onstop ? [{ fn: e.onstop }] : [], o._onmute = e.onmute ? [{ fn: e.onmute }] : [], o._onvolume = e.onvolume ? [{ fn: e.onvolume }] : [], o._onrate = e.onrate ? [{ fn: e.onrate }] : [], o._onseek = e.onseek ? [{ fn: e.onseek }] : [], o._onresume = [], o._webAudio = n.usingWebAudio && !o._html5, void 0 !== n.ctx && n.ctx && n.mobileAutoEnable && n._enableMobileAudio(), n._howls.push(o), o._autoplay && o._queue.push({ event: "play", action: function action() {
          o.play();
        } }), o._preload && o.load(), o;
    }, load: function load() {
      var e = this,
          o = null;if (n.noAudio) return void e._emit("loaderror", null, "No audio support.");"string" == typeof e._src && (e._src = [e._src]);for (var r = 0; r < e._src.length; r++) {
        var u, i;if (e._format && e._format[r]) u = e._format[r];else {
          if ("string" != typeof (i = e._src[r])) {
            e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");continue;
          }u = /^data:audio\/([^;,]+);/i.exec(i), u || (u = /\.([^.]+)$/.exec(i.split("?", 1)[0])), u && (u = u[1].toLowerCase());
        }if (u || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'), u && n.codecs(u)) {
          o = e._src[r];break;
        }
      }return o ? (e._src = o, e._state = "loading", "https:" === window.location.protocol && "http:" === o.slice(0, 5) && (e._html5 = !0, e._webAudio = !1), new t(e), e._webAudio && a(e), e) : void e._emit("loaderror", null, "No codec support for selected audio sources.");
    }, play: function play(e, o) {
      var t = this,
          r = null;if ("number" == typeof e) r = e, e = null;else {
        if ("string" == typeof e && "loaded" === t._state && !t._sprite[e]) return null;if (void 0 === e) {
          e = "__default";for (var a = 0, u = 0; u < t._sounds.length; u++) {
            t._sounds[u]._paused && !t._sounds[u]._ended && (a++, r = t._sounds[u]._id);
          }1 === a ? e = null : r = null;
        }
      }var i = r ? t._soundById(r) : t._inactiveSound();if (!i) return null;if (r && !e && (e = i._sprite || "__default"), "loaded" !== t._state) {
        i._sprite = e, i._ended = !1;var d = i._id;return t._queue.push({ event: "play", action: function action() {
            t.play(d);
          } }), d;
      }if (r && !i._paused) return o || setTimeout(function () {
        t._emit("play", i._id);
      }, 0), i._id;t._webAudio && n._autoResume();var _ = Math.max(0, i._seek > 0 ? i._seek : t._sprite[e][0] / 1e3),
          s = Math.max(0, (t._sprite[e][0] + t._sprite[e][1]) / 1e3 - _),
          l = 1e3 * s / Math.abs(i._rate);i._paused = !1, i._ended = !1, i._sprite = e, i._seek = _, i._start = t._sprite[e][0] / 1e3, i._stop = (t._sprite[e][0] + t._sprite[e][1]) / 1e3, i._loop = !(!i._loop && !t._sprite[e][2]);var c = i._node;if (t._webAudio) {
        var f = function f() {
          t._refreshBuffer(i);var e = i._muted || t._muted ? 0 : i._volume;c.gain.setValueAtTime(e, n.ctx.currentTime), i._playStart = n.ctx.currentTime, void 0 === c.bufferSource.start ? i._loop ? c.bufferSource.noteGrainOn(0, _, 86400) : c.bufferSource.noteGrainOn(0, _, s) : i._loop ? c.bufferSource.start(0, _, 86400) : c.bufferSource.start(0, _, s), l !== 1 / 0 && (t._endTimers[i._id] = setTimeout(t._ended.bind(t, i), l)), o || setTimeout(function () {
            t._emit("play", i._id);
          }, 0);
        };"running" === n.state ? f() : (t.once("resume", f), t._clearTimer(i._id));
      } else {
        var p = function p() {
          c.currentTime = _, c.muted = i._muted || t._muted || n._muted || c.muted, c.volume = i._volume * n.volume(), c.playbackRate = i._rate;try {
            var e = c.play();if ("undefined" != typeof Promise && e instanceof Promise && (t._playLock = !0, e.then(function () {
              t._playLock = !1, t._loadQueue();
            })), c.paused) return void t._emit("playerror", i._id, "Playback was unable to start. This is most commonly an issue on mobile devices where playback was not within a user interaction.");l !== 1 / 0 && (t._endTimers[i._id] = setTimeout(t._ended.bind(t, i), l)), o || t._emit("play", i._id);
          } catch (e) {
            t._emit("playerror", i._id, e);
          }
        },
            m = window && window.ejecta || !c.readyState && n._navigator.isCocoonJS;if (4 === c.readyState || m) p();else {
          var v = function v() {
            p(), c.removeEventListener(n._canPlayEvent, v, !1);
          };c.addEventListener(n._canPlayEvent, v, !1), t._clearTimer(i._id);
        }
      }return i._id;
    }, pause: function pause(e) {
      var n = this;if ("loaded" !== n._state || n._playLock) return n._queue.push({ event: "pause", action: function action() {
          n.pause(e);
        } }), n;for (var o = n._getSoundIds(e), t = 0; t < o.length; t++) {
        n._clearTimer(o[t]);var r = n._soundById(o[t]);if (r && !r._paused && (r._seek = n.seek(o[t]), r._rateSeek = 0, r._paused = !0, n._stopFade(o[t]), r._node)) if (n._webAudio) {
          if (!r._node.bufferSource) continue;void 0 === r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0), n._cleanBuffer(r._node);
        } else isNaN(r._node.duration) && r._node.duration !== 1 / 0 || r._node.pause();arguments[1] || n._emit("pause", r ? r._id : null);
      }return n;
    }, stop: function stop(e, n) {
      var o = this;if ("loaded" !== o._state) return o._queue.push({ event: "stop", action: function action() {
          o.stop(e);
        } }), o;for (var t = o._getSoundIds(e), r = 0; r < t.length; r++) {
        o._clearTimer(t[r]);var a = o._soundById(t[r]);a && (a._seek = a._start || 0, a._rateSeek = 0, a._paused = !0, a._ended = !0, o._stopFade(t[r]), a._node && (o._webAudio ? a._node.bufferSource && (void 0 === a._node.bufferSource.stop ? a._node.bufferSource.noteOff(0) : a._node.bufferSource.stop(0), o._cleanBuffer(a._node)) : isNaN(a._node.duration) && a._node.duration !== 1 / 0 || (a._node.currentTime = a._start || 0, a._node.pause())), n || o._emit("stop", a._id));
      }return o;
    }, mute: function mute(e, o) {
      var t = this;if ("loaded" !== t._state) return t._queue.push({ event: "mute", action: function action() {
          t.mute(e, o);
        } }), t;if (void 0 === o) {
        if ("boolean" != typeof e) return t._muted;t._muted = e;
      }for (var r = t._getSoundIds(o), a = 0; a < r.length; a++) {
        var u = t._soundById(r[a]);u && (u._muted = e, u._interval && t._stopFade(u._id), t._webAudio && u._node ? u._node.gain.setValueAtTime(e ? 0 : u._volume, n.ctx.currentTime) : u._node && (u._node.muted = !!n._muted || e), t._emit("mute", u._id));
      }return t;
    }, volume: function volume() {
      var e,
          o,
          t = this,
          r = arguments;if (0 === r.length) return t._volume;if (1 === r.length || 2 === r.length && void 0 === r[1]) {
        t._getSoundIds().indexOf(r[0]) >= 0 ? o = parseInt(r[0], 10) : e = parseFloat(r[0]);
      } else r.length >= 2 && (e = parseFloat(r[0]), o = parseInt(r[1], 10));var a;if (!(void 0 !== e && e >= 0 && e <= 1)) return a = o ? t._soundById(o) : t._sounds[0], a ? a._volume : 0;if ("loaded" !== t._state) return t._queue.push({ event: "volume", action: function action() {
          t.volume.apply(t, r);
        } }), t;void 0 === o && (t._volume = e), o = t._getSoundIds(o);for (var u = 0; u < o.length; u++) {
        (a = t._soundById(o[u])) && (a._volume = e, r[2] || t._stopFade(o[u]), t._webAudio && a._node && !a._muted ? a._node.gain.setValueAtTime(e, n.ctx.currentTime) : a._node && !a._muted && (a._node.volume = e * n.volume()), t._emit("volume", a._id));
      }return t;
    }, fade: function fade(e, o, t, r) {
      var a = this;if ("loaded" !== a._state) return a._queue.push({ event: "fade", action: function action() {
          a.fade(e, o, t, r);
        } }), a;a.volume(e, r);for (var u = a._getSoundIds(r), i = 0; i < u.length; i++) {
        var d = a._soundById(u[i]);if (d) {
          if (r || a._stopFade(u[i]), a._webAudio && !d._muted) {
            var _ = n.ctx.currentTime,
                s = _ + t / 1e3;d._volume = e, d._node.gain.setValueAtTime(e, _), d._node.gain.linearRampToValueAtTime(o, s);
          }a._startFadeInterval(d, e, o, t, u[i], void 0 === r);
        }
      }return a;
    }, _startFadeInterval: function _startFadeInterval(e, n, o, t, r, a) {
      var u = this,
          i = n,
          d = n > o ? "out" : "in",
          _ = Math.abs(n - o),
          s = _ / .01,
          l = s > 0 ? t / s : t;l < 4 && (s = Math.ceil(s / (4 / l)), l = 4), e._fadeTo = o, e._interval = setInterval(function () {
        s > 0 && (i += "in" === d ? .01 : -.01), i = Math.max(0, i), i = Math.min(1, i), i = Math.round(100 * i) / 100, u._webAudio ? e._volume = i : u.volume(i, e._id, !0), a && (u._volume = i), (o < n && i <= o || o > n && i >= o) && (clearInterval(e._interval), e._interval = null, e._fadeTo = null, u.volume(o, e._id), u._emit("fade", e._id));
      }, l);
    }, _stopFade: function _stopFade(e) {
      var o = this,
          t = o._soundById(e);return t && t._interval && (o._webAudio && t._node.gain.cancelScheduledValues(n.ctx.currentTime), clearInterval(t._interval), t._interval = null, o.volume(t._fadeTo, e), t._fadeTo = null, o._emit("fade", e)), o;
    }, loop: function loop() {
      var e,
          n,
          o,
          t = this,
          r = arguments;if (0 === r.length) return t._loop;if (1 === r.length) {
        if ("boolean" != typeof r[0]) return !!(o = t._soundById(parseInt(r[0], 10))) && o._loop;e = r[0], t._loop = e;
      } else 2 === r.length && (e = r[0], n = parseInt(r[1], 10));for (var a = t._getSoundIds(n), u = 0; u < a.length; u++) {
        (o = t._soundById(a[u])) && (o._loop = e, t._webAudio && o._node && o._node.bufferSource && (o._node.bufferSource.loop = e, e && (o._node.bufferSource.loopStart = o._start || 0, o._node.bufferSource.loopEnd = o._stop)));
      }return t;
    }, rate: function rate() {
      var e,
          o,
          t = this,
          r = arguments;if (0 === r.length) o = t._sounds[0]._id;else if (1 === r.length) {
        var a = t._getSoundIds(),
            u = a.indexOf(r[0]);u >= 0 ? o = parseInt(r[0], 10) : e = parseFloat(r[0]);
      } else 2 === r.length && (e = parseFloat(r[0]), o = parseInt(r[1], 10));var i;if ("number" != typeof e) return i = t._soundById(o), i ? i._rate : t._rate;if ("loaded" !== t._state) return t._queue.push({ event: "rate", action: function action() {
          t.rate.apply(t, r);
        } }), t;void 0 === o && (t._rate = e), o = t._getSoundIds(o);for (var d = 0; d < o.length; d++) {
        if (i = t._soundById(o[d])) {
          i._rateSeek = t.seek(o[d]), i._playStart = t._webAudio ? n.ctx.currentTime : i._playStart, i._rate = e, t._webAudio && i._node && i._node.bufferSource ? i._node.bufferSource.playbackRate.value = e : i._node && (i._node.playbackRate = e);var _ = t.seek(o[d]),
              s = (t._sprite[i._sprite][0] + t._sprite[i._sprite][1]) / 1e3 - _,
              l = 1e3 * s / Math.abs(i._rate);!t._endTimers[o[d]] && i._paused || (t._clearTimer(o[d]), t._endTimers[o[d]] = setTimeout(t._ended.bind(t, i), l)), t._emit("rate", i._id);
        }
      }return t;
    }, seek: function seek() {
      var e,
          o,
          t = this,
          r = arguments;if (0 === r.length) o = t._sounds[0]._id;else if (1 === r.length) {
        var a = t._getSoundIds(),
            u = a.indexOf(r[0]);u >= 0 ? o = parseInt(r[0], 10) : t._sounds.length && (o = t._sounds[0]._id, e = parseFloat(r[0]));
      } else 2 === r.length && (e = parseFloat(r[0]), o = parseInt(r[1], 10));if (void 0 === o) return t;if ("loaded" !== t._state) return t._queue.push({ event: "seek", action: function action() {
          t.seek.apply(t, r);
        } }), t;var i = t._soundById(o);if (i) {
        if (!("number" == typeof e && e >= 0)) {
          if (t._webAudio) {
            var d = t.playing(o) ? n.ctx.currentTime - i._playStart : 0,
                _ = i._rateSeek ? i._rateSeek - i._seek : 0;return i._seek + (_ + d * Math.abs(i._rate));
          }return i._node.currentTime;
        }var s = t.playing(o);s && t.pause(o, !0), i._seek = e, i._ended = !1, t._clearTimer(o), s && t.play(o, !0), !t._webAudio && i._node && (i._node.currentTime = e), t._emit("seek", o);
      }return t;
    }, playing: function playing(e) {
      var n = this;if ("number" == typeof e) {
        var o = n._soundById(e);return !!o && !o._paused;
      }for (var t = 0; t < n._sounds.length; t++) {
        if (!n._sounds[t]._paused) return !0;
      }return !1;
    }, duration: function duration(e) {
      var n = this,
          o = n._duration,
          t = n._soundById(e);return t && (o = n._sprite[t._sprite][1] / 1e3), o;
    }, state: function state() {
      return this._state;
    }, unload: function unload() {
      for (var e = this, o = e._sounds, t = 0; t < o.length; t++) {
        if (o[t]._paused || e.stop(o[t]._id), !e._webAudio) {
          /MSIE |Trident\//.test(n._navigator && n._navigator.userAgent) || (o[t]._node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"), o[t]._node.removeEventListener("error", o[t]._errorFn, !1), o[t]._node.removeEventListener(n._canPlayEvent, o[t]._loadFn, !1);
        }delete o[t]._node, e._clearTimer(o[t]._id);var a = n._howls.indexOf(e);a >= 0 && n._howls.splice(a, 1);
      }var u = !0;for (t = 0; t < n._howls.length; t++) {
        if (n._howls[t]._src === e._src) {
          u = !1;break;
        }
      }return r && u && delete r[e._src], n.noAudio = !1, e._state = "unloaded", e._sounds = [], e = null, null;
    }, on: function on(e, n, o, t) {
      var r = this,
          a = r["_on" + e];return "function" == typeof n && a.push(t ? { id: o, fn: n, once: t } : { id: o, fn: n }), r;
    }, off: function off(e, n, o) {
      var t = this,
          r = t["_on" + e],
          a = 0;if ("number" == typeof n && (o = n, n = null), n || o) for (a = 0; a < r.length; a++) {
        var u = o === r[a].id;if (n === r[a].fn && u || !n && u) {
          r.splice(a, 1);break;
        }
      } else if (e) t["_on" + e] = [];else {
        var i = Object.keys(t);for (a = 0; a < i.length; a++) {
          0 === i[a].indexOf("_on") && Array.isArray(t[i[a]]) && (t[i[a]] = []);
        }
      }return t;
    }, once: function once(e, n, o) {
      var t = this;return t.on(e, n, o, 1), t;
    }, _emit: function _emit(e, n, o) {
      for (var t = this, r = t["_on" + e], a = r.length - 1; a >= 0; a--) {
        r[a].id && r[a].id !== n && "load" !== e || (setTimeout(function (e) {
          e.call(this, n, o);
        }.bind(t, r[a].fn), 0), r[a].once && t.off(e, r[a].fn, r[a].id));
      }return t;
    }, _loadQueue: function _loadQueue() {
      var e = this;if (e._queue.length > 0) {
        var n = e._queue[0];e.once(n.event, function () {
          e._queue.shift(), e._loadQueue();
        }), n.action();
      }return e;
    }, _ended: function _ended(e) {
      var o = this,
          t = e._sprite;if (!o._webAudio && e._node && !e._node.paused && !e._node.ended && e._node.currentTime < e._stop) return setTimeout(o._ended.bind(o, e), 100), o;var r = !(!e._loop && !o._sprite[t][2]);if (o._emit("end", e._id), !o._webAudio && r && o.stop(e._id, !0).play(e._id), o._webAudio && r) {
        o._emit("play", e._id), e._seek = e._start || 0, e._rateSeek = 0, e._playStart = n.ctx.currentTime;var a = 1e3 * (e._stop - e._start) / Math.abs(e._rate);o._endTimers[e._id] = setTimeout(o._ended.bind(o, e), a);
      }return o._webAudio && !r && (e._paused = !0, e._ended = !0, e._seek = e._start || 0, e._rateSeek = 0, o._clearTimer(e._id), o._cleanBuffer(e._node), n._autoSuspend()), o._webAudio || r || o.stop(e._id), o;
    }, _clearTimer: function _clearTimer(e) {
      var n = this;return n._endTimers[e] && (clearTimeout(n._endTimers[e]), delete n._endTimers[e]), n;
    }, _soundById: function _soundById(e) {
      for (var n = this, o = 0; o < n._sounds.length; o++) {
        if (e === n._sounds[o]._id) return n._sounds[o];
      }return null;
    }, _inactiveSound: function _inactiveSound() {
      var e = this;e._drain();for (var n = 0; n < e._sounds.length; n++) {
        if (e._sounds[n]._ended) return e._sounds[n].reset();
      }return new t(e);
    }, _drain: function _drain() {
      var e = this,
          n = e._pool,
          o = 0,
          t = 0;if (!(e._sounds.length < n)) {
        for (t = 0; t < e._sounds.length; t++) {
          e._sounds[t]._ended && o++;
        }for (t = e._sounds.length - 1; t >= 0; t--) {
          if (o <= n) return;e._sounds[t]._ended && (e._webAudio && e._sounds[t]._node && e._sounds[t]._node.disconnect(0), e._sounds.splice(t, 1), o--);
        }
      }
    }, _getSoundIds: function _getSoundIds(e) {
      var n = this;if (void 0 === e) {
        for (var o = [], t = 0; t < n._sounds.length; t++) {
          o.push(n._sounds[t]._id);
        }return o;
      }return [e];
    }, _refreshBuffer: function _refreshBuffer(e) {
      var o = this;return e._node.bufferSource = n.ctx.createBufferSource(), e._node.bufferSource.buffer = r[o._src], e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node), e._node.bufferSource.loop = e._loop, e._loop && (e._node.bufferSource.loopStart = e._start || 0, e._node.bufferSource.loopEnd = e._stop), e._node.bufferSource.playbackRate.value = e._rate, o;
    }, _cleanBuffer: function _cleanBuffer(e) {
      var o = this;if (n._scratchBuffer) {
        e.bufferSource.onended = null, e.bufferSource.disconnect(0);try {
          e.bufferSource.buffer = n._scratchBuffer;
        } catch (e) {}
      }return e.bufferSource = null, o;
    } };var t = function t(e) {
    this._parent = e, this.init();
  };t.prototype = { init: function init() {
      var e = this,
          o = e._parent;return e._muted = o._muted, e._loop = o._loop, e._volume = o._volume, e._rate = o._rate, e._seek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, o._sounds.push(e), e.create(), e;
    }, create: function create() {
      var e = this,
          o = e._parent,
          t = n._muted || e._muted || e._parent._muted ? 0 : e._volume;return o._webAudio ? (e._node = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), e._node.gain.setValueAtTime(t, n.ctx.currentTime), e._node.paused = !0, e._node.connect(n.masterGain)) : (e._node = new Audio(), e._errorFn = e._errorListener.bind(e), e._node.addEventListener("error", e._errorFn, !1), e._loadFn = e._loadListener.bind(e), e._node.addEventListener(n._canPlayEvent, e._loadFn, !1), e._node.src = o._src, e._node.preload = "auto", e._node.volume = t * n.volume(), e._node.load()), e;
    }, reset: function reset() {
      var e = this,
          o = e._parent;return e._muted = o._muted, e._loop = o._loop, e._volume = o._volume, e._rate = o._rate, e._seek = 0, e._rateSeek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, e;
    }, _errorListener: function _errorListener() {
      var e = this;e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0), e._node.removeEventListener("error", e._errorFn, !1);
    }, _loadListener: function _loadListener() {
      var e = this,
          o = e._parent;o._duration = Math.ceil(10 * e._node.duration) / 10, 0 === Object.keys(o._sprite).length && (o._sprite = { __default: [0, 1e3 * o._duration] }), "loaded" !== o._state && (o._state = "loaded", o._emit("load"), o._loadQueue()), e._node.removeEventListener(n._canPlayEvent, e._loadFn, !1);
    } };var r = {},
      a = function a(e) {
    var n = e._src;if (r[n]) return e._duration = r[n].duration, void d(e);if (/^data:[^;]+;base64,/.test(n)) {
      for (var o = atob(n.split(",")[1]), t = new Uint8Array(o.length), a = 0; a < o.length; ++a) {
        t[a] = o.charCodeAt(a);
      }i(t.buffer, e);
    } else {
      var _ = new XMLHttpRequest();_.open("GET", n, !0), _.withCredentials = e._xhrWithCredentials, _.responseType = "arraybuffer", _.onload = function () {
        var n = (_.status + "")[0];if ("0" !== n && "2" !== n && "3" !== n) return void e._emit("loaderror", null, "Failed loading audio file with status: " + _.status + ".");i(_.response, e);
      }, _.onerror = function () {
        e._webAudio && (e._html5 = !0, e._webAudio = !1, e._sounds = [], delete r[n], e.load());
      }, u(_);
    }
  },
      u = function u(e) {
    try {
      e.send();
    } catch (n) {
      e.onerror();
    }
  },
      i = function i(e, o) {
    n.ctx.decodeAudioData(e, function (e) {
      e && o._sounds.length > 0 && (r[o._src] = e, d(o, e));
    }, function () {
      o._emit("loaderror", null, "Decoding audio data failed.");
    });
  },
      d = function d(e, n) {
    n && !e._duration && (e._duration = n.duration), 0 === Object.keys(e._sprite).length && (e._sprite = { __default: [0, 1e3 * e._duration] }), "loaded" !== e._state && (e._state = "loaded", e._emit("load"), e._loadQueue());
  },
      _ = function _() {
    try {
      "undefined" != typeof AudioContext ? n.ctx = new AudioContext() : "undefined" != typeof webkitAudioContext ? n.ctx = new webkitAudioContext() : n.usingWebAudio = !1;
    } catch (e) {
      n.usingWebAudio = !1;
    }var e = /iP(hone|od|ad)/.test(n._navigator && n._navigator.platform),
        o = n._navigator && n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
        t = o ? parseInt(o[1], 10) : null;if (e && t && t < 9) {
      var r = /safari/.test(n._navigator && n._navigator.userAgent.toLowerCase());(n._navigator && n._navigator.standalone && !r || n._navigator && !n._navigator.standalone && !r) && (n.usingWebAudio = !1);
    }n.usingWebAudio && (n.masterGain = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), n.masterGain.gain.setValueAtTime(n._muted ? 0 : 1, n.ctx.currentTime), n.masterGain.connect(n.ctx.destination)), n._setup();
  };"function" == "function" && __webpack_require__(22) && !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
    return { Howler: n, Howl: o };
  }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)), "undefined" != typeof exports && (exports.Howler = n, exports.Howl = o), "undefined" != typeof window ? (window.HowlerGlobal = e, window.Howler = n, window.Howl = o, window.Sound = t) : "undefined" != typeof global && (global.HowlerGlobal = e, global.Howler = n, global.Howl = o, global.Sound = t);
}();
/*! Spatial Plugin */
!function () {
  "use strict";
  HowlerGlobal.prototype._pos = [0, 0, 0], HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0], HowlerGlobal.prototype.stereo = function (n) {
    var e = this;if (!e.ctx || !e.ctx.listener) return e;for (var t = e._howls.length - 1; t >= 0; t--) {
      e._howls[t].stereo(n);
    }return e;
  }, HowlerGlobal.prototype.pos = function (n, e, t) {
    var o = this;return o.ctx && o.ctx.listener ? (e = "number" != typeof e ? o._pos[1] : e, t = "number" != typeof t ? o._pos[2] : t, "number" != typeof n ? o._pos : (o._pos = [n, e, t], o.ctx.listener.setPosition(o._pos[0], o._pos[1], o._pos[2]), o)) : o;
  }, HowlerGlobal.prototype.orientation = function (n, e, t, o, r, a) {
    var i = this;if (!i.ctx || !i.ctx.listener) return i;var p = i._orientation;return e = "number" != typeof e ? p[1] : e, t = "number" != typeof t ? p[2] : t, o = "number" != typeof o ? p[3] : o, r = "number" != typeof r ? p[4] : r, a = "number" != typeof a ? p[5] : a, "number" != typeof n ? p : (i._orientation = [n, e, t, o, r, a], i.ctx.listener.setOrientation(n, e, t, o, r, a), i);
  }, Howl.prototype.init = function (n) {
    return function (e) {
      var t = this;return t._orientation = e.orientation || [1, 0, 0], t._stereo = e.stereo || null, t._pos = e.pos || null, t._pannerAttr = { coneInnerAngle: void 0 !== e.coneInnerAngle ? e.coneInnerAngle : 360, coneOuterAngle: void 0 !== e.coneOuterAngle ? e.coneOuterAngle : 360, coneOuterGain: void 0 !== e.coneOuterGain ? e.coneOuterGain : 0, distanceModel: void 0 !== e.distanceModel ? e.distanceModel : "inverse", maxDistance: void 0 !== e.maxDistance ? e.maxDistance : 1e4, panningModel: void 0 !== e.panningModel ? e.panningModel : "HRTF", refDistance: void 0 !== e.refDistance ? e.refDistance : 1, rolloffFactor: void 0 !== e.rolloffFactor ? e.rolloffFactor : 1 }, t._onstereo = e.onstereo ? [{ fn: e.onstereo }] : [], t._onpos = e.onpos ? [{ fn: e.onpos }] : [], t._onorientation = e.onorientation ? [{ fn: e.onorientation }] : [], n.call(this, e);
    };
  }(Howl.prototype.init), Howl.prototype.stereo = function (e, t) {
    var o = this;if (!o._webAudio) return o;if ("loaded" !== o._state) return o._queue.push({ event: "stereo", action: function action() {
        o.stereo(e, t);
      } }), o;var r = void 0 === Howler.ctx.createStereoPanner ? "spatial" : "stereo";if (void 0 === t) {
      if ("number" != typeof e) return o._stereo;o._stereo = e, o._pos = [e, 0, 0];
    }for (var a = o._getSoundIds(t), i = 0; i < a.length; i++) {
      var p = o._soundById(a[i]);if (p) {
        if ("number" != typeof e) return p._stereo;p._stereo = e, p._pos = [e, 0, 0], p._node && (p._pannerAttr.panningModel = "equalpower", p._panner && p._panner.pan || n(p, r), "spatial" === r ? p._panner.setPosition(e, 0, 0) : p._panner.pan.setValueAtTime(e, Howler.ctx.currentTime)), o._emit("stereo", p._id);
      }
    }return o;
  }, Howl.prototype.pos = function (e, t, o, r) {
    var a = this;if (!a._webAudio) return a;if ("loaded" !== a._state) return a._queue.push({ event: "pos", action: function action() {
        a.pos(e, t, o, r);
      } }), a;if (t = "number" != typeof t ? 0 : t, o = "number" != typeof o ? -.5 : o, void 0 === r) {
      if ("number" != typeof e) return a._pos;a._pos = [e, t, o];
    }for (var i = a._getSoundIds(r), p = 0; p < i.length; p++) {
      var s = a._soundById(i[p]);if (s) {
        if ("number" != typeof e) return s._pos;s._pos = [e, t, o], s._node && (s._panner && !s._panner.pan || n(s, "spatial"), s._panner.setPosition(e, t, o)), a._emit("pos", s._id);
      }
    }return a;
  }, Howl.prototype.orientation = function (e, t, o, r) {
    var a = this;if (!a._webAudio) return a;if ("loaded" !== a._state) return a._queue.push({ event: "orientation", action: function action() {
        a.orientation(e, t, o, r);
      } }), a;if (t = "number" != typeof t ? a._orientation[1] : t, o = "number" != typeof o ? a._orientation[2] : o, void 0 === r) {
      if ("number" != typeof e) return a._orientation;a._orientation = [e, t, o];
    }for (var i = a._getSoundIds(r), p = 0; p < i.length; p++) {
      var s = a._soundById(i[p]);if (s) {
        if ("number" != typeof e) return s._orientation;s._orientation = [e, t, o], s._node && (s._panner || (s._pos || (s._pos = a._pos || [0, 0, -.5]), n(s, "spatial")), s._panner.setOrientation(e, t, o)), a._emit("orientation", s._id);
      }
    }return a;
  }, Howl.prototype.pannerAttr = function () {
    var e,
        t,
        o,
        r = this,
        a = arguments;if (!r._webAudio) return r;if (0 === a.length) return r._pannerAttr;if (1 === a.length) {
      if ("object" != _typeof(a[0])) return o = r._soundById(parseInt(a[0], 10)), o ? o._pannerAttr : r._pannerAttr;e = a[0], void 0 === t && (e.pannerAttr || (e.pannerAttr = { coneInnerAngle: e.coneInnerAngle, coneOuterAngle: e.coneOuterAngle, coneOuterGain: e.coneOuterGain, distanceModel: e.distanceModel, maxDistance: e.maxDistance, refDistance: e.refDistance, rolloffFactor: e.rolloffFactor, panningModel: e.panningModel }), r._pannerAttr = { coneInnerAngle: void 0 !== e.pannerAttr.coneInnerAngle ? e.pannerAttr.coneInnerAngle : r._coneInnerAngle, coneOuterAngle: void 0 !== e.pannerAttr.coneOuterAngle ? e.pannerAttr.coneOuterAngle : r._coneOuterAngle, coneOuterGain: void 0 !== e.pannerAttr.coneOuterGain ? e.pannerAttr.coneOuterGain : r._coneOuterGain, distanceModel: void 0 !== e.pannerAttr.distanceModel ? e.pannerAttr.distanceModel : r._distanceModel, maxDistance: void 0 !== e.pannerAttr.maxDistance ? e.pannerAttr.maxDistance : r._maxDistance, refDistance: void 0 !== e.pannerAttr.refDistance ? e.pannerAttr.refDistance : r._refDistance, rolloffFactor: void 0 !== e.pannerAttr.rolloffFactor ? e.pannerAttr.rolloffFactor : r._rolloffFactor, panningModel: void 0 !== e.pannerAttr.panningModel ? e.pannerAttr.panningModel : r._panningModel });
    } else 2 === a.length && (e = a[0], t = parseInt(a[1], 10));for (var i = r._getSoundIds(t), p = 0; p < i.length; p++) {
      if (o = r._soundById(i[p])) {
        var s = o._pannerAttr;s = { coneInnerAngle: void 0 !== e.coneInnerAngle ? e.coneInnerAngle : s.coneInnerAngle, coneOuterAngle: void 0 !== e.coneOuterAngle ? e.coneOuterAngle : s.coneOuterAngle, coneOuterGain: void 0 !== e.coneOuterGain ? e.coneOuterGain : s.coneOuterGain, distanceModel: void 0 !== e.distanceModel ? e.distanceModel : s.distanceModel, maxDistance: void 0 !== e.maxDistance ? e.maxDistance : s.maxDistance, refDistance: void 0 !== e.refDistance ? e.refDistance : s.refDistance, rolloffFactor: void 0 !== e.rolloffFactor ? e.rolloffFactor : s.rolloffFactor, panningModel: void 0 !== e.panningModel ? e.panningModel : s.panningModel };var l = o._panner;l ? (l.coneInnerAngle = s.coneInnerAngle, l.coneOuterAngle = s.coneOuterAngle, l.coneOuterGain = s.coneOuterGain, l.distanceModel = s.distanceModel, l.maxDistance = s.maxDistance, l.refDistance = s.refDistance, l.rolloffFactor = s.rolloffFactor, l.panningModel = s.panningModel) : (o._pos || (o._pos = r._pos || [0, 0, -.5]), n(o, "spatial"));
      }
    }return r;
  }, Sound.prototype.init = function (n) {
    return function () {
      var e = this,
          t = e._parent;e._orientation = t._orientation, e._stereo = t._stereo, e._pos = t._pos, e._pannerAttr = t._pannerAttr, n.call(this), e._stereo ? t.stereo(e._stereo) : e._pos && t.pos(e._pos[0], e._pos[1], e._pos[2], e._id);
    };
  }(Sound.prototype.init), Sound.prototype.reset = function (n) {
    return function () {
      var e = this,
          t = e._parent;return e._orientation = t._orientation, e._pos = t._pos, e._pannerAttr = t._pannerAttr, n.call(this);
    };
  }(Sound.prototype.reset);var n = function n(_n, e) {
    e = e || "spatial", "spatial" === e ? (_n._panner = Howler.ctx.createPanner(), _n._panner.coneInnerAngle = _n._pannerAttr.coneInnerAngle, _n._panner.coneOuterAngle = _n._pannerAttr.coneOuterAngle, _n._panner.coneOuterGain = _n._pannerAttr.coneOuterGain, _n._panner.distanceModel = _n._pannerAttr.distanceModel, _n._panner.maxDistance = _n._pannerAttr.maxDistance, _n._panner.refDistance = _n._pannerAttr.refDistance, _n._panner.rolloffFactor = _n._pannerAttr.rolloffFactor, _n._panner.panningModel = _n._pannerAttr.panningModel, _n._panner.setPosition(_n._pos[0], _n._pos[1], _n._pos[2]), _n._panner.setOrientation(_n._orientation[0], _n._orientation[1], _n._orientation[2])) : (_n._panner = Howler.ctx.createStereoPanner(), _n._panner.pan.setValueAtTime(_n._stereo, Howler.ctx.currentTime)), _n._panner.connect(_n._node), _n._paused || _n._parent.pause(_n._id, !0).play(_n._id);
  };
}();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ })
/******/ ]);