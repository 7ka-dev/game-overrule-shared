"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DICE_FACES = exports.MAX_DICE = exports.DICE_COUNT = void 0;
exports.rollDie = rollDie;
exports.rollDice = rollDice;
exports.rerollDice = rerollDice;
exports.withExtraDie = withExtraDie;
exports.avoidBannedFace = avoidBannedFace;
exports.createSeededRandom = createSeededRandom;
exports.DICE_COUNT = 5;
exports.MAX_DICE = 6;
exports.DICE_FACES = 6;
function rollDie(random = Math.random) {
    return (Math.floor(random() * exports.DICE_FACES) + 1);
}
function rollDice(random = Math.random, count = exports.DICE_COUNT) {
    return Array.from({ length: count }, () => rollDie(random));
}
/**
 * Rerolls every die except the ones marked in `locked`.
 * Returns a new array and does not mutate the input.
 */
function rerollDice(dice, locked, random = Math.random) {
    return dice.map((value, index) => (locked[index] ? value : rollDie(random)));
}
/**
 * Adds a sixth die if it is not present yet ("Extra die" rule).
 * The extra die's face participates in combination scoring.
 */
function withExtraDie(dice, random = Math.random) {
    if (dice.length >= exports.MAX_DICE) {
        return [...dice];
    }
    return [...dice, rollDie(random)];
}
/** Rerolls faces banned by a rule (for example, "no sixes"). */
function avoidBannedFace(dice, banned, random = Math.random) {
    if (banned === null) {
        return [...dice];
    }
    return dice.map((value) => {
        let next = value;
        for (let attempt = 0; attempt < exports.DICE_FACES * 4 && next === banned; attempt += 1) {
            next = rollDie(random);
        }
        return next;
    });
}
/**
 * Deterministic generator for tests and the server-side Best Guess AI.
 * mulberry32 is a compact PRNG with acceptable quality.
 */
function createSeededRandom(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
