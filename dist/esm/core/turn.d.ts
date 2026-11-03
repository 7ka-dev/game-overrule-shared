/**
 * Turn rules. Pure functions, testable without Colyseus or UI.
 */
import { type ActiveRule } from "./rules.js";
/** Maximum rolls per turn (GDD §2). */
export declare const MAX_ROLLS = 3;
/** Turn duration for one player, in seconds (GDD §2). */
export declare const TURN_SECONDS = 20;
export declare const MIN_TURN_SECONDS = 10;
export declare const MAX_TURN_SECONDS = 60;
export declare function isValidTurnDuration(seconds: unknown): seconds is number;
/** Applies a card adjustment without exceeding the room's configured turn budget. */
export declare function adjustTurnSeconds(currentSeconds: number, deltaSeconds: number, maxSeconds: number): number;
/** Delay before autoplay takes over for a disconnected player (ADR-002). */
export declare const DISCONNECT_GRACE_SECONDS = 5;
export declare const RECONNECT_WINDOW_SECONDS = 60;
/** Next index in the circle. An input of -1 means there is no active player yet. */
export declare function nextPlayerIndex(currentIndex: number, playerCount: number): number;
/**
 * After the third roll the player must commit a score (GDD: "third-roll rule").
 */
export declare function isRollsExhausted(rollsLeft: number): boolean;
/** The turn returned to the first player, so the round is complete. */
export declare function isRoundComplete(nextIndex: number): boolean;
export interface RerollState {
    hasRolled: boolean;
    rollsLeft: number;
    turnRolls: number;
}
/** The player has already rerolled at least once this turn. */
export declare function hasRerolled(state: RerollState): boolean;
/** Whether a reroll is possible under the current rule set. */
export declare function canReroll(state: RerollState, rules: readonly ActiveRule[]): boolean;
/**
 * "Forced reroll" blocks committing until the first reroll. If the rules make
 * a reroll impossible (for example, reroll-limit = 0), the card must not
 * deadlock the turn, so committing is allowed.
 */
export declare function mustReroll(state: RerollState, rules: readonly ActiveRule[]): boolean;
