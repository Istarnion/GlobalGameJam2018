export const tileIDs = {
    floor: 0,
    wall: 1
};

export const createFloor = () => {
    return {
        id: tileIDs.floor
    }
};

export const createWall = () => {
    return {
        id: tileIDs.wall
        solid: true
    };
};

