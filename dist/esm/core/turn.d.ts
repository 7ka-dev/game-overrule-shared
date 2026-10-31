/**
 * Turn rules. Pure functions, testable without Colyseus or UI.
 */
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
