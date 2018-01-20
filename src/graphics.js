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

