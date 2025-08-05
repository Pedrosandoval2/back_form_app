export const objectWithoutUndefined = (object: {}) => {
    return Object.fromEntries(
        Object.entries(object).filter(([clave, valor]) => valor !== undefined)
    );
}