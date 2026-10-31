import type { DiceArray, DiceValue } from "../types/dice.js";

export const DICE_COUNT = 5;
export const MAX_DICE = 6;
export const DICE_FACES = 6;

export type RandomFn = () => number;

export function rollDie(random: RandomFn = Math.random): DiceValue {
  return (Math.floor(random() * DICE_FACES) + 1) as DiceValue;
}

export function rollDice(random: RandomFn = Math.random, count = DICE_COUNT): DiceArray {
  return Array.from({ length: count }, () => rollDie(random)) as DiceArray;
}
/**
 * Rerolls every die except the ones marked in `locked`.
 * Returns a new array and does not mutate the input.
 */
export function rerollDice(
  dice: readonly number[],
  locked: readonly boolean[],
  random: RandomFn = Math.random,
): number[] {
  return dice.map((value, index) => (locked[index] ? value : rollDie(random)));
}

/**
 * Adds a sixth die if it is not present yet ("Extra die" rule).
 * The extra die's face participates in combination scoring.
 */
export function withExtraDie(dice: readonly number[], random: RandomFn = Math.random): number[] {
  if (dice.length >= MAX_DICE) {
    return [...dice];
  }
  return [...dice, rollDie(random)];
}

/** Rerolls faces banned by a rule (for example, "no sixes"). */
export function avoidBannedFace(
  dice: readonly number[],
  banned: number | null,
  random: RandomFn = Math.random,
): number[] {
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
 * Deterministic generator for tests and the server-side Best Guess AI.
 * mulberry32 is a compact PRNG with acceptable quality.
 */
export function createSeededRandom(seed: number): RandomFn {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
