import { ruleNumber, ruleOf, type ActiveRule } from "./rules.js";

/**
 * Card-control rules (ADR-018, ADR-022).
 *
 * These helpers are shared by the authoritative engine and the client so both
 * sides agree on whether a protocol can be played.
 */

export interface StandingsPlayer {
  sessionId: string;
  score: number;
}

/** `card-timing = before-roll`: cards may only be played before the first roll. */
export function cardTiming(rules: readonly ActiveRule[]): "before-roll" | null {
  const rule = ruleOf(rules, "card-timing");
  return rule?.value === "before-roll" ? "before-roll" : null;
}

/** `card-lock-round = N`: no cards while the current round is <= N. */
export function cardLockRound(rules: readonly ActiveRule[]): number | null {
  const rule = ruleOf(rules, "card-lock-round");
  if (!rule) {
    return null;
  }
  const value = ruleNumber(rule, 0);
  return Number.isInteger(value) && value > 0 ? value : null;
}

/** `turn-start-dice = previous`: inherit the previous player's final dice. */
export function turnStartsFromPreviousDice(rules: readonly ActiveRule[]): boolean {
  return ruleOf(rules, "turn-start-dice")?.value === "previous";
}

/** `reroll-face-limit`: only dice of the selected face may be rerolled. */
export function hasRerollFaceLimit(rules: readonly ActiveRule[]): boolean {
  return ruleOf(rules, "reroll-face-limit") !== undefined;
}

export type HiddenDiceMode = "all" | "first-three";

export function hiddenDiceMode(rules: readonly ActiveRule[]): HiddenDiceMode | null {
  const rule = ruleOf(rules, "hidden-dice");
  if (rule?.value === "all" || rule?.value === "first-three") {
    return rule.value;
  }
  return null;
}

/**
 * Client-side mask from ADR-020. Other players and spectators still see the
 * real dice; only the active player's own view is masked.
 */
export function hiddenDiceMask(
  rules: readonly ActiveRule[],
  diceCount: number,
  viewerIsActive: boolean,
): boolean[] {
  const mode = hiddenDiceMode(rules);
  if (!mode || !viewerIsActive) {
    return Array.from({ length: diceCount }, () => false);
  }
  return Array.from({ length: diceCount }, (_, index) =>
    mode === "all" || index < 3,
  );
}

/**
 * Per-turn protocol limit.
 *
 * Default is 1. With `standings-card-limit`, a unique leader gets 0 and a
 * unique last player gets 2. Ties (including a tie for both places) keep the
 * default limit.
 */
export function maxCardsPerTurn(
  rules: readonly ActiveRule[],
  players: readonly StandingsPlayer[],
  sessionId: string,
): number {
  if (!ruleOf(rules, "standings-card-limit") || players.length < 2) {
    return 1;
  }

  const scores = players.map((player) => player.score);
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  const leaders = players.filter((player) => player.score === highest);
  const lastPlayers = players.filter((player) => player.score === lowest);

  if (leaders.length === 1 && leaders[0]?.sessionId === sessionId) {
    return 0;
  }
  if (lastPlayers.length === 1 && lastPlayers[0]?.sessionId === sessionId) {
    return 2;
  }
  return 1;
}
