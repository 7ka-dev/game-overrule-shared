"use strict";
/**
 * Turn rules. Pure functions, testable without Colyseus or UI.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECONNECT_WINDOW_SECONDS = exports.DISCONNECT_GRACE_SECONDS = exports.MAX_TURN_SECONDS = exports.MIN_TURN_SECONDS = exports.TURN_SECONDS = exports.MAX_ROLLS = void 0;
exports.isValidTurnDuration = isValidTurnDuration;
exports.adjustTurnSeconds = adjustTurnSeconds;
exports.nextPlayerIndex = nextPlayerIndex;
exports.isRollsExhausted = isRollsExhausted;
exports.isRoundComplete = isRoundComplete;
/** Maximum rolls per turn (GDD §2). */
exports.MAX_ROLLS = 3;
/** Turn duration for one player, in seconds (GDD §2). */
exports.TURN_SECONDS = 20;
exports.MIN_TURN_SECONDS = 10;
exports.MAX_TURN_SECONDS = 60;
function isValidTurnDuration(seconds) {
    return (typeof seconds === "number" &&
        Number.isInteger(seconds) &&
        seconds >= exports.MIN_TURN_SECONDS &&
        seconds <= exports.MAX_TURN_SECONDS);
}
/** Applies a card adjustment without exceeding the room's configured turn budget. */
function adjustTurnSeconds(currentSeconds, deltaSeconds, maxSeconds) {
    return Math.min(maxSeconds, Math.max(0, currentSeconds + deltaSeconds));
}
/** Delay before autoplay takes over for a disconnected player (ADR-002). */
exports.DISCONNECT_GRACE_SECONDS = 5;
exports.RECONNECT_WINDOW_SECONDS = 60;
/** Next index in the circle. An input of -1 means there is no active player yet. */
function nextPlayerIndex(currentIndex, playerCount) {
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
function isRollsExhausted(rollsLeft) {
    return rollsLeft <= 0;
}
/** The turn returned to the first player, so the round is complete. */
function isRoundComplete(nextIndex) {
    return nextIndex === 0;
}
