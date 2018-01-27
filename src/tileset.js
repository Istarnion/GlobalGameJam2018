import { gfx, images } from "./graphics.js";

export class Tileset {
    constructor(image, tileWidth, tileHeight, margin, spacing) {
        this.tilemap = images[image];
        this.width = tileWidth;
        this.height = tileHeight;
        this.margin = margin;
        this.spacing = spacing;

        this.imgWidth = this.tilemap.width;
        this.widthWithSpacing = this.width + this.spacing;
        this.heightWithSpacing = this.height + this.spacing;
        this.tilesAcross = Math.floor(imgWidth / widthWithSpacing);
    }

    /*
     * 'tile' is a number from 1 to n, where 0 would draw the top left tile in the sheet,
     * and 1 would draw the tile to the right of that one, and so on.
     * 0 is accepted, but will not draw anything. ( For empty tiles )
     * These numbers are the same as they would be in Tiled
     */
    drawTile(tile, x, y) {
        if(tile === 0) return;

        --tile;

        gfx.drawImage(
            this.tilemap,
            this.margin + this.widthWithSpacing * (tile % this.tilesAcross),
            this.margin + this.heightWithSpacing * Math.floor(tile / tilesAcross),
            this.width, this.height,
            x, y, this.width, this.height);
    }
}

