import { Directions } from "./utils.js";

const canvas = document.getElementById("game-canvas");
export const gfx = canvas.getContext("2d");

// Turn off anti-aliasing for images.
const disableAntiAlias = () => {
    gfx.mozImageSmoothingEnabled = false;
    gfx.webkitImageSmoothingEnabled = false;
    gfx.msImageSmoothingEnabled = false;
    gfx.imageSmoothingEnabled = false;
};

const pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
gfx.scale(pixelRatio, pixelRatio);
gfx.save(); // Save the default scale (transform)

gfx.width = canvas.clientWidth;
gfx.height = canvas.clientHeight;

let last_resize = 0;
const onResize = () => {
    const now = performance.now();
    if(now - last_resize < 10) return;
    last_resize = now;

    const w = window.innerWidth;
    const h = window.innerHeight;

    const wanted_ratio = gfx.width / gfx.height;
    const curr_ratio = w / h;

    let scale = 1;

    if(curr_ratio >= wanted_ratio) {
        scale = h / gfx.height;
        if(scale > 1) scale = Math.floor(scale);
    }
    else {
        scale = w / gfx.width;
        if(scale > 1) scale = Math.floor(scale);
    }

    canvas.width = (gfx.width * scale) * pixelRatio;
    canvas.height = (gfx.height * scale) * pixelRatio;
    canvas.style.width = `${gfx.width * scale}px`;
    canvas.style.height = `${gfx.height * scale}px`;

    gfx.restore(); // Restore default scale
    gfx.save();    // ...and save it again
    gfx.scale(scale * pixelRatio, scale * pixelRatio);
    disableAntiAlias();
};

window.addEventListener("resize", onResize);

gfx.drawLine = (x_from, y_from, x_to, y_to) => {
    this.gfx.beginPath();
    this.gfx.moveTo(x_from, y_from);
    this.gfx.lineTo(x_to, y_to);
    this.gfx.closePath();
    this.gfx.stroke();
}

export const setGameSize = (w, h) => {
    gfx.width = w;
    gfx.height = h;
    onResize();
};

// Clear the canvas
export const clear = () => {
    gfx.clearRect(0, 0, gfx.width, gfx.height);
};

// A cache of loaded sprites. Access them by sprites[sprite_name]
export const sprites = {};

// Load a single image. Input format: ["name", "file"]
export const loadImage = (image_to_load) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = function() {
            sprites[image_to_load[0]] = image;
            resolve();
        }

        image.onerror = function() {
            reject(image_to_load);
        }

        image.src = image_to_load[1];
    });
};

// Load multiple images. Input format; [["name1", "file1"], ["name2", "file2"], ...]
export const loadImages = (images_to_load) => {
    return new Promise((resolve, reject) => {
        if(images_to_load.length === 0) {
            resolve();
            return;
        }

        const image_promises = [];

        images_to_load.forEach((image) => {
            image_promises.push(loadImage(image));
        });

        Promise.all(image_promises)
        .then(() => {
            resolve();
        })
        .catch((failed_images) => {
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
export const getBitmap = (image) => {
    const img = sprites[image];
    if(!img) {
        console.error(`${image} is not loaded`);
        return null;
    }

    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");

    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    ctx.clearRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);

    const result = {
        width: img.width,
        height: img.height,
        pixels: ctx.getImageData(0, 0, img.width, img.height).data,
        getPixel: function(x, y) {
            const start = y * this.width * 4 + x * 4;
            const pixel = {
                r: this.pixels[start + 0],
                g: this.pixels[start + 1],
                b: this.pixels[start + 2],
                a: this.pixels[start + 3]
            };

            return pixel;
        }
    };

    return result;
}

export const drawSprite = (colorOrImage, x, y, offsetX = 0, offsetY = 0, dir = Directions.up) => {
    gfx.save();
    gfx.translate(48+x*32+16+offsetX, 12+y*32+16+offsetY);

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

    if(typeof colorOrImage === "string") {
        gfx.fillStyle = colorOrImage;
        gfx.fillRect(-16, -16, 32, 32);
    }
    else {
        gfx.drawImage(colorOrImage, -16, -16, 32, 32);
    }

    gfx.restore();
}

