"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = shuffle;
/**
 * Fisher-Yates shuffle. Returns a new array and does not mutate the input.
 * `random` is injectable so tests can be deterministic.
 */
function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const swapWith = Math.floor(random() * (index + 1));
        const current = result[index];
        result[index] = result[swapWith];
        result[swapWith] = current;
    }
    return result;
}
