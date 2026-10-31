import type { CardId, RuleAspect } from "../types/card.js";

/**
 * Active global rule for a match (ADR-013/015).
 *
 * A rule affects all players until the end of the match, until a card with
 * the same aspect replaces it. It lives in replicated state because both the
 * server (authoritative calculations) and the client (hints and score preview)
 * need it.
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
 * Applies a rule: an existing rule with the same aspect is replaced.
 * Returns a new array and does not mutate the input.
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
 * Number of rerolls allowed per turn. The "no rerolls" card yields 0,
 * "only one reroll" yields 1.
 */
export function rerollLimit(rules: readonly ActiveRule[]): number {
  return ruleNumber(ruleOf(rules, "reroll-limit"), DEFAULT_REROLLS);
}
