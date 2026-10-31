import type { RandomFn } from "../core/dice.js";
/**
 * Fisher-Yates shuffle. Returns a new array and does not mutate the input.
 * `random` is injectable so tests can be deterministic.
 */
export declare function shuffle<T>(items: readonly T[], random?: RandomFn): T[];
