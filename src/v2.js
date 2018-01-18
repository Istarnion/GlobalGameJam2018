export class V2 {

    constructor(_x=0, _y=0) {
        this.x = _x;
        this.y = _y;
    }

    add(v_or_x, y) {
        if(!y) {
            this.x += v_or_x.x;
            this.y += v_or_x.y;
        }
        else {
            this.x += v_or_x;
            this.y += y;
        }
    }

    static add(v1, v2) {
        return new V2(v1.x+v2.x, v1.y+v2.y);
    }

    sub(v_or_x, y) {
        if(!y) {
            this.x -= v_or_x.x;
            this.y -= v_or_x.y;
        }
        else {
            this.x -= v_or_x;
            this.y -= y;
        }
    }

    static sub(v1, v2) {
        return new V2(v1.x+v2.x, v1.y+v2.y);
    }

    normalize() {
        const len = Math.sqrt(this.x*this.x + this.y*this.y);
        if(len != 0) {
            this.x /= len;
            this.y /= len;
        }
    }

    get normalized() {
        const length = this.length;
        if(length) {
            return new V2(x/length, y/length);
        }
        else {
            return new V2(0, 0);
        }
    }

    get length() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    get length_sqr() {
        return (this.x*this.x + this.y*this.y);
    }

    dot(v_or_x, y) {
        if(!y) {
            return this.x*v_or_x.x + this.y*v_or_x.y;
        }
        else {
            return this.x*v_or_x + this.y*y;
        }
    }
}

