export function capitalize(prop) {
    if(!prop) {
        return prop;
    }
    const user_prop = prop.trim();
    prop = user_prop[0].toUpperCase();
    prop += user_prop.slice(1, user_prop.length);
    return prop;
}