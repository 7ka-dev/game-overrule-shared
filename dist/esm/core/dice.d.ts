import type { DiceArray, DiceValue } from "../types/dice.js";
export declare const DICE_COUNT = 5;
export declare const MAX_DICE = 6;
export declare const DICE_FACES = 6;
export type RandomFn = () => number;
export declare function rollDie(random?: RandomFn): DiceValue;
export declare function rollDice(random?: RandomFn, count?: number): DiceArray;
/**
 * Rerolls every die except the ones marked in `locked`.
 * Returns a new array and does not mutate the input.
 */
export declare function rerollDice(dice: readonly number[], locked: readonly boolean[], random?: RandomFn): number[];
/**
 * Adds a sixth die if it is not present yet ("Extra die" rule).
 * The extra die's face participates in combination scoring.
 */
export declare function withExtraDie(dice: readonly number[], random?: RandomFn): number[];
/** Rerolls faces banned by a rule (for example, "no sixes"). */
export declare function avoidBannedFace(dice: readonly number[], banned: number | null, random?: RandomFn): number[];
/**
 * Deterministic generator for tests and the server-side Best Guess AI.
 * mulberry32 is a compact PRNG with acceptable quality.
 */
export declare function createSeededRandom(seed: number): RandomFn;
