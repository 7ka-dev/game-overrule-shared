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
 * Перебрасывает все кубики, кроме отмеченных в locked.
 * Возвращает новый массив, не мутируя исходный.
 */
export function rerollDice(
  dice: readonly number[],
  locked: readonly boolean[],
  random: RandomFn = Math.random,
): number[] {
  return dice.map((value, index) => (locked[index] ? value : rollDie(random)));
}

/**
 * Добавляет шестой кубик, если его ещё нет (правило «Лишний кубик»).
 * Грань лишнего кубика участвует в подсчёте комбинаций.
 */
export function withExtraDie(dice: readonly number[], random: RandomFn = Math.random): number[] {
  if (dice.length >= MAX_DICE) {
    return [...dice];
  }
  return [...dice, rollDie(random)];
}

/** Перебрасывает грани, которые запрещены правилом (например, «нет шестёрок»). */
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
 * Детерминированный генератор для тестов и серверного Best Guess AI.
 * mulberry32 — компактный PRNG с приемлемым качеством.
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
