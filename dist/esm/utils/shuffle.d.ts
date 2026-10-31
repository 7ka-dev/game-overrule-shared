import type { RandomFn } from "../core/dice.js";
/**
 * Перемешивание Фишера—Йетса. Возвращает новый массив, не мутируя исходный.
 * `random` параметризован, чтобы тесты были детерминированными.
 */
export declare function shuffle<T>(items: readonly T[], random?: RandomFn): T[];
