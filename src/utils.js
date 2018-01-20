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

