export function isDiceValue(v) {
    return Number.isInteger(v) && v >= 1 && v <= 6;
}
export function createEmptyDice() {
    return [1, 1, 1, 1, 1];
}
