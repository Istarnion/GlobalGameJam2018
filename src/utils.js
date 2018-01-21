export const getPropertyOrDefault = (obj, prop, def) => {
    if(obj.hasOwnProperty(prop)) return obj[prop];
    else return def;
}

export const requireProperty = (obj, prop) => {
    if(obj.hasOwnProperty(prop) && !!obj[prop]) return obj[prop];
    else {
        console.error(`The property ${prop} is required in ${obj}, but is not present!`);
        return obj[prop];
    }
}

// Removes the given element from the given array.
// Returns true if the element was found and removed,
// false otherwise.
export const removeFromArray = (array, element) => {
    const index = array.indexOf(element);
    if(index >= 0) {
        array.splice(index, 1);
        return true;
    }

    return false;
}

