/**
 * Turn rules. Pure functions, testable without Colyseus or UI.
 */

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
