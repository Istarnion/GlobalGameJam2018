const canvas = document.getElementById("game-canvas");
export const gfx = canvas.getContext("2d");
gfx.save();

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

    canvas.width = gfx.width * scale;
    canvas.height = gfx.height * scale;

    gfx.restore();
    gfx.save();
    gfx.scale(scale, scale);
};

window.addEventListener("resize", onResize);

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
    console.assert(images_to_load);

    return new Promise((resolve, reject) => {
        if(images_to_load.length === 0) {
            resolve();
            return;
        }

        const image_promises = [];

        images_to_load.forEach((image) => {
            image_promises.push(this.loadImage(image));
        });

        image_promises.all
        .then(() => {
            resolve();
        })
        .catch((failed_images) => {
            reject(failed_images);
        });
    });
};

