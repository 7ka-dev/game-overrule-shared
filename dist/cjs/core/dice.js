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
 * Перебрасывает все кубики, кроме отмеченных в locked.
 * Возвращает новый массив, не мутируя исходный.
 */
function rerollDice(dice, locked, random = Math.random) {
    return dice.map((value, index) => (locked[index] ? value : rollDie(random)));
}
/**
 * Добавляет шестой кубик, если его ещё нет (правило «Лишний кубик»).
 * Грань лишнего кубика участвует в подсчёте комбинаций.
 */
function withExtraDie(dice, random = Math.random) {
    if (dice.length >= exports.MAX_DICE) {
        return [...dice];
    }
    return [...dice, rollDie(random)];
}
/** Перебрасывает грани, которые запрещены правилом (например, «нет шестёрок»). */
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
 * Детерминированный генератор для тестов и серверного Best Guess AI.
 * mulberry32 — компактный PRNG с приемлемым качеством.
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
