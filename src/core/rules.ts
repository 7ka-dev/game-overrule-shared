import type { CardId, RuleAspect } from "../types/card.js";

/**
 * Активное глобальное правило партии (ADR-013/015).
 *
 * Правило действует на всех игроков до конца партии, пока его не перекроет
 * карта того же аспекта. Живёт в синхронизируемом состоянии, потому что её
 * видят и сервер (авторитарные расчёты), и клиент (подсказки и preview очков).
 */
export interface ActiveRule {
  id: string;
  cardId: CardId;
  aspect: RuleAspect;
  value: string;
  ownerId: string;
}

export function ruleOf(
  rules: readonly ActiveRule[],
  aspect: RuleAspect,
): ActiveRule | undefined {
  return rules.find((rule) => rule.aspect === aspect);
}

export function hasRule(rules: readonly ActiveRule[], aspect: RuleAspect): boolean {
  return ruleOf(rules, aspect) !== undefined;
}

/**
 * Установка правила: правило того же аспекта заменяется.
 * Возвращает новый массив, исходный не мутируется.
 */
export function upsertRule(rules: readonly ActiveRule[], next: ActiveRule): ActiveRule[] {
  const filtered = rules.filter((rule) => rule.aspect !== next.aspect);
  return [...filtered, next];
}

export function ruleNumber(rule: ActiveRule | undefined, fallback: number): number {
  if (!rule) {
    return fallback;
  }
  const value = Number(rule.value);
  return Number.isFinite(value) ? value : fallback;
}

export const DEFAULT_REROLLS = 2;

/**
 * Сколько перебросов разрешено за ход. Карта «запрет перебросов» даёт 0,
 * «только один переброс» — 1.
 */
export function rerollLimit(rules: readonly ActiveRule[]): number {
  return ruleNumber(ruleOf(rules, "reroll-limit"), DEFAULT_REROLLS);
}
