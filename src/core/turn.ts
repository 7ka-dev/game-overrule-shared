/**
 * Turn rules. Pure functions, testable without Colyseus or UI.
 */

import { hasRule, rerollLimit, type ActiveRule } from "./rules.js";

/** Maximum rolls per turn (GDD §2). */
export const MAX_ROLLS = 3;

/** Turn duration for one player, in seconds (GDD §2). */
export const TURN_SECONDS = 20;
export const MIN_TURN_SECONDS = 10;
export const MAX_TURN_SECONDS = 60;

export function isValidTurnDuration(seconds: unknown): seconds is number {
  return (
    typeof seconds === "number" &&
    Number.isInteger(seconds) &&
    seconds >= MIN_TURN_SECONDS &&
    seconds <= MAX_TURN_SECONDS
  );
}

/** Applies a card adjustment without exceeding the room's configured turn budget. */
export function adjustTurnSeconds(currentSeconds: number, deltaSeconds: number, maxSeconds: number): number {
  return Math.min(maxSeconds, Math.max(0, currentSeconds + deltaSeconds));
}

/** Delay before autoplay takes over for a disconnected player (ADR-002). */
export const DISCONNECT_GRACE_SECONDS = 5;
export const RECONNECT_WINDOW_SECONDS = 60;

/** Next index in the circle. An input of -1 means there is no active player yet. */
export function nextPlayerIndex(currentIndex: number, playerCount: number): number {
  if (playerCount <= 0) {
    return -1;
  }
  if (currentIndex < 0 || currentIndex >= playerCount) {
    return 0;
  }
  return (currentIndex + 1) % playerCount;
}

/**
 * After the third roll the player must commit a score (GDD: "third-roll rule").
 */
export function isRollsExhausted(rollsLeft: number): boolean {
  return rollsLeft <= 0;
}

/** The turn returned to the first player, so the round is complete. */
export function isRoundComplete(nextIndex: number): boolean {
  return nextIndex === 0;
}

export interface RerollState {
  hasRolled: boolean;
  rollsLeft: number;
  turnRolls: number;
}

/** The player has already rerolled at least once this turn. */
export function hasRerolled(state: RerollState): boolean {
  return state.rollsLeft < state.turnRolls - 1;
}

/** Whether a reroll is possible under the current rule set. */
export function canReroll(
  state: RerollState,
  rules: readonly ActiveRule[],
): boolean {
  if (!state.hasRolled || state.rollsLeft <= 0) {
    return false;
  }
  const used = state.turnRolls - state.rollsLeft - 1;
  const bonus = Math.max(0, state.turnRolls - MAX_ROLLS);
  return used < rerollLimit(rules) + bonus;
}

/**
 * "Forced reroll" blocks committing until the first reroll. If the rules make
 * a reroll impossible (for example, reroll-limit = 0), the card must not
 * deadlock the turn, so committing is allowed.
 */
export function mustReroll(
  state: RerollState,
  rules: readonly ActiveRule[],
): boolean {
  return (
    hasRule(rules, "forced-reroll") &&
    state.hasRolled &&
    !hasRerolled(state) &&
    canReroll(state, rules)
  );
}
