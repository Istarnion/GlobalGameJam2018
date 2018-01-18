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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _graphics = __webpack_require__(/*! ./graphics.js */ 1);\n\n(0, _graphics.setGameSize)(640, 480);\n\n// TODO: Draw loading scree\n\nvar update = function update() {\n    (0, _graphics.clear)();\n\n    _graphics.gfx.fillStyle = \"#2d2d2d\";\n    _graphics.gfx.fillRect(0, 0, _graphics.gfx.width, _graphics.gfx.height);\n\n    _graphics.gfx.fillStyle = \"white\";\n    _graphics.gfx.fillRect(_graphics.gfx.width / 2 - 32, _graphics.gfx.height / 2 - 32, 64, 64);\n    _graphics.gfx.fillRect(0, 0, 64, 64);\n\n    _graphics.gfx.fillStyle = \"red\";\n\n    window.requestAnimationFrame(update);\n};\n\n(0, _graphics.loadImages)([\n    // TODO(istarnion): Add _all_ images here to preload them\n]).then(function () {\n    // When done loading images, start the main loop\n    update();\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvYXBwLmpzP2JkOWMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2Z4LCBzZXRHYW1lU2l6ZSwgY2xlYXIsIGxvYWRJbWFnZXMgfSBmcm9tIFwiLi9ncmFwaGljcy5qc1wiO1xuXG5zZXRHYW1lU2l6ZSg2NDAsIDQ4MCk7XG5cbi8vIFRPRE86IERyYXcgbG9hZGluZyBzY3JlZVxuXG5jb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgY2xlYXIoKTtcblxuICAgIGdmeC5maWxsU3R5bGUgPSBcIiMyZDJkMmRcIjtcbiAgICBnZnguZmlsbFJlY3QoMCwgMCwgZ2Z4LndpZHRoLCBnZnguaGVpZ2h0KTtcblxuICAgIGdmeC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgZ2Z4LmZpbGxSZWN0KGdmeC53aWR0aCAvIDIgLSAzMiwgZ2Z4LmhlaWdodCAvIDIgLSAzMiwgNjQsIDY0KTtcbiAgICBnZnguZmlsbFJlY3QoMCwgMCwgNjQsIDY0KTtcblxuICAgIGdmeC5maWxsU3R5bGUgPSBcInJlZFwiO1xuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xufVxuXG5sb2FkSW1hZ2VzKFtcbiAgICAvLyBUT0RPKGlzdGFybmlvbik6IEFkZCBfYWxsXyBpbWFnZXMgaGVyZSB0byBwcmVsb2FkIHRoZW1cbl0pLnRoZW4oKCkgPT4ge1xuICAgIC8vIFdoZW4gZG9uZSBsb2FkaW5nIGltYWdlcywgc3RhcnQgdGhlIG1haW4gbG9vcFxuICAgIHVwZGF0ZSgpO1xufSk7XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBwLmpzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/*!*************************!*\
  !*** ./src/graphics.js ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nvar canvas = document.getElementById(\"game-canvas\");\nvar gfx = exports.gfx = canvas.getContext(\"2d\");\n\ngfx.width = canvas.clientWidth;\ngfx.height = canvas.clientHeight;\n\nvar last_resize = performance.now();\nvar onResize = function onResize() {\n    var now = performance.now();\n    if (now - last_resize < 10) return;\n\n    console.log(\"resizing\");\n\n    var w = canvas.clientWidth;\n    var h = canvas.clientHeight;\n\n    var wanted_ratio = gfx.width / gfx.height;\n    var curr_ratio = w / h;\n\n    console.log(w, h, gfx.width, gfx.height);\n\n    var scale = 1;\n\n    if (curr_ratio >= wanted_ratio) {\n        scale = Math.floor(h / gfx.height);\n    } else {\n        scale = Math.floor(w / gfx.width);\n    }\n    console.log(scale);\n\n    canvas.width = gfx.width * scale;\n    canvas.height = gfx.height * scale;\n\n    gfx.scale(scale, scale);\n};\n\nwindow.addEventListener(\"resize\", onResize);\n\nvar setGameSize = exports.setGameSize = function setGameSize(w, h) {\n    gfx.width = w;\n    gfx.height = h;\n    onResize();\n};\n\n// Clear the canvas\nvar clear = exports.clear = function clear() {\n    gfx.clearRect(0, 0, gfx.width, gfx.height);\n};\n\n// A cache of loaded sprites. Access them by sprites[sprite_name]\nvar sprites = exports.sprites = {};\n\n// Load a single image. Input format: [\"name\", \"file\"]\nvar loadImage = exports.loadImage = function loadImage(image_to_load) {\n    return new Promise(function (resolve, reject) {\n        var image = new Image();\n        image.onload = function () {\n            sprites[image_to_load[0]] = image;\n            resolve();\n        };\n\n        image.onerror = function () {\n            reject(image_to_load);\n        };\n\n        image.src = image_to_load[1];\n    });\n};\n\n// Load multiple images. Input format; [[\"name1\", \"file1\"], [\"name2\", \"file2\"], ...]\nvar loadImages = exports.loadImages = function loadImages(images_to_load) {\n    console.assert(images_to_load);\n\n    return new Promise(function (resolve, reject) {\n        if (images_to_load.length === 0) {\n            resolve();\n            return;\n        }\n\n        var image_promises = [];\n\n        images_to_load.forEach(function (image) {\n            image_promises.push(undefined.loadImage(image));\n        });\n\n        image_promises.all.then(function () {\n            resolve();\n        }).catch(function (failed_images) {\n            reject(failed_images);\n        });\n    });\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zcmMvZ3JhcGhpY3MuanM/ZGQ0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY2FudmFzXCIpO1xuZXhwb3J0IGNvbnN0IGdmeCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbmdmeC53aWR0aCA9IGNhbnZhcy5jbGllbnRXaWR0aDtcbmdmeC5oZWlnaHQgPSBjYW52YXMuY2xpZW50SGVpZ2h0O1xuXG5sZXQgbGFzdF9yZXNpemUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmNvbnN0IG9uUmVzaXplID0gKCkgPT4ge1xuICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGlmKG5vdyAtIGxhc3RfcmVzaXplIDwgMTApIHJldHVybjtcblxuICAgIGNvbnNvbGUubG9nKFwicmVzaXppbmdcIik7XG5cbiAgICBjb25zdCB3ID0gY2FudmFzLmNsaWVudFdpZHRoO1xuICAgIGNvbnN0IGggPSBjYW52YXMuY2xpZW50SGVpZ2h0O1xuXG4gICAgY29uc3Qgd2FudGVkX3JhdGlvID0gZ2Z4LndpZHRoIC8gZ2Z4LmhlaWdodDtcbiAgICBjb25zdCBjdXJyX3JhdGlvID0gdyAvIGg7XG5cbiAgICBjb25zb2xlLmxvZyh3LCBoLCBnZngud2lkdGgsIGdmeC5oZWlnaHQpO1xuXG4gICAgbGV0IHNjYWxlID0gMVxuXG4gICAgaWYoY3Vycl9yYXRpbyA+PSB3YW50ZWRfcmF0aW8pIHtcbiAgICAgICAgc2NhbGUgPSBNYXRoLmZsb29yKGggLyBnZnguaGVpZ2h0KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHNjYWxlID0gTWF0aC5mbG9vcih3IC8gZ2Z4LndpZHRoKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coc2NhbGUpO1xuXG4gICAgY2FudmFzLndpZHRoID0gZ2Z4LndpZHRoICogc2NhbGU7XG4gICAgY2FudmFzLmhlaWdodCA9IGdmeC5oZWlnaHQgKiBzY2FsZTtcblxuICAgIGdmeC5zY2FsZShzY2FsZSwgc2NhbGUpO1xufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25SZXNpemUpO1xuXG5leHBvcnQgY29uc3Qgc2V0R2FtZVNpemUgPSAodywgaCkgPT4ge1xuICAgIGdmeC53aWR0aCA9IHc7XG4gICAgZ2Z4LmhlaWdodCA9IGg7XG4gICAgb25SZXNpemUoKTtcbn07XG5cbi8vIENsZWFyIHRoZSBjYW52YXNcbmV4cG9ydCBjb25zdCBjbGVhciA9ICgpID0+IHtcbiAgICBnZnguY2xlYXJSZWN0KDAsIDAsIGdmeC53aWR0aCwgZ2Z4LmhlaWdodCk7XG59O1xuXG4vLyBBIGNhY2hlIG9mIGxvYWRlZCBzcHJpdGVzLiBBY2Nlc3MgdGhlbSBieSBzcHJpdGVzW3Nwcml0ZV9uYW1lXVxuZXhwb3J0IGNvbnN0IHNwcml0ZXMgPSB7fTtcblxuLy8gTG9hZCBhIHNpbmdsZSBpbWFnZS4gSW5wdXQgZm9ybWF0OiBbXCJuYW1lXCIsIFwiZmlsZVwiXVxuZXhwb3J0IGNvbnN0IGxvYWRJbWFnZSA9IChpbWFnZV90b19sb2FkKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzcHJpdGVzW2ltYWdlX3RvX2xvYWRbMF1dID0gaW1hZ2U7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZWplY3QoaW1hZ2VfdG9fbG9hZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbWFnZS5zcmMgPSBpbWFnZV90b19sb2FkWzFdO1xuICAgIH0pO1xufTtcblxuLy8gTG9hZCBtdWx0aXBsZSBpbWFnZXMuIElucHV0IGZvcm1hdDsgW1tcIm5hbWUxXCIsIFwiZmlsZTFcIl0sIFtcIm5hbWUyXCIsIFwiZmlsZTJcIl0sIC4uLl1cbmV4cG9ydCBjb25zdCBsb2FkSW1hZ2VzID0gKGltYWdlc190b19sb2FkKSA9PiB7XG4gICAgY29uc29sZS5hc3NlcnQoaW1hZ2VzX3RvX2xvYWQpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYoaW1hZ2VzX3RvX2xvYWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbWFnZV9wcm9taXNlcyA9IFtdO1xuXG4gICAgICAgIGltYWdlc190b19sb2FkLmZvckVhY2goKGltYWdlKSA9PiB7XG4gICAgICAgICAgICBpbWFnZV9wcm9taXNlcy5wdXNoKHRoaXMubG9hZEltYWdlKGltYWdlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGltYWdlX3Byb21pc2VzLmFsbFxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZmFpbGVkX2ltYWdlcykgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGZhaWxlZF9pbWFnZXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZ3JhcGhpY3MuanMiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///1\n");

/***/ })
/******/ ]);