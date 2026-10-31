export const DICE_COUNT = 5;
export const MAX_DICE = 6;
export const DICE_FACES = 6;
export function rollDie(random = Math.random) {
    return (Math.floor(random() * DICE_FACES) + 1);
}
export function rollDice(random = Math.random, count = DICE_COUNT) {
    return Array.from({ length: count }, () => rollDie(random));
}
/**
 * Перебрасывает все кубики, кроме отмеченных в locked.
 * Возвращает новый массив, не мутируя исходный.
 */
export function rerollDice(dice, locked, random = Math.random) {
    return dice.map((value, index) => (locked[index] ? value : rollDie(random)));
}
/**
 * Добавляет шестой кубик, если его ещё нет (правило «Лишний кубик»).
 * Грань лишнего кубика участвует в подсчёте комбинаций.
 */
export function withExtraDie(dice, random = Math.random) {
    if (dice.length >= MAX_DICE) {
        return [...dice];
    }
    return [...dice, rollDie(random)];
}
/** Перебрасывает грани, которые запрещены правилом (например, «нет шестёрок»). */
export function avoidBannedFace(dice, banned, random = Math.random) {
    if (banned === null) {
        return [...dice];
    }
    return dice.map((value) => {
        let next = value;
        for (let attempt = 0; attempt < DICE_FACES * 4 && next === banned; attempt += 1) {
            next = rollDie(random);
        }
        return next;
    });
}
/**
 * Детерминированный генератор для тестов и серверного Best Guess AI.
 * mulberry32 — компактный PRNG с приемлемым качеством.
 */
export function createSeededRandom(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
