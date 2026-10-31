"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDiceValue = isDiceValue;
exports.createEmptyDice = createEmptyDice;
function isDiceValue(v) {
    return Number.isInteger(v) && v >= 1 && v <= 6;
}
function createEmptyDice() {
    return [1, 1, 1, 1, 1];
}
