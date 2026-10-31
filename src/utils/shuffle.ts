import type { RandomFn } from "../core/dice.js";

/**
 * Fisher-Yates shuffle. Returns a new array and does not mutate the input.
 * `random` is injectable so tests can be deterministic.
 */
export function shuffle<T>(items: readonly T[], random: RandomFn = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1));
    const current = result[index];
    result[index] = result[swapWith];
    result[swapWith] = current;
  }
  return result;
}
