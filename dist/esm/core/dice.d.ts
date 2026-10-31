import type { DiceArray, DiceValue } from "../types/dice.js";
export declare const DICE_COUNT = 5;
export declare const MAX_DICE = 6;
export declare const DICE_FACES = 6;
export type RandomFn = () => number;
export declare function rollDie(random?: RandomFn): DiceValue;
export declare function rollDice(random?: RandomFn, count?: number): DiceArray;
/**
 * Перебрасывает все кубики, кроме отмеченных в locked.
 * Возвращает новый массив, не мутируя исходный.
 */
export declare function rerollDice(dice: readonly number[], locked: readonly boolean[], random?: RandomFn): number[];
/**
 * Добавляет шестой кубик, если его ещё нет (правило «Лишний кубик»).
 * Грань лишнего кубика участвует в подсчёте комбинаций.
 */
export declare function withExtraDie(dice: readonly number[], random?: RandomFn): number[];
/** Перебрасывает грани, которые запрещены правилом (например, «нет шестёрок»). */
export declare function avoidBannedFace(dice: readonly number[], banned: number | null, random?: RandomFn): number[];
/**
 * Детерминированный генератор для тестов и серверного Best Guess AI.
 * mulberry32 — компактный PRNG с приемлемым качеством.
 */
export declare function createSeededRandom(seed: number): RandomFn;
