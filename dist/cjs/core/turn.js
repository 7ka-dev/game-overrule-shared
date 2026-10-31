"use strict";
/**
 * Правила хода. Чистые функции — тестируются без Colyseus и без UI.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECONNECT_WINDOW_SECONDS = exports.DISCONNECT_GRACE_SECONDS = exports.MAX_TURN_SECONDS = exports.MIN_TURN_SECONDS = exports.TURN_SECONDS = exports.MAX_ROLLS = void 0;
exports.isValidTurnDuration = isValidTurnDuration;
exports.adjustTurnSeconds = adjustTurnSeconds;
exports.nextPlayerIndex = nextPlayerIndex;
exports.isRollsExhausted = isRollsExhausted;
exports.isRoundComplete = isRoundComplete;
/** Максимум бросков за ход (GDD §2). */
exports.MAX_ROLLS = 3;
/** Длительность хода одного игрока, секунды (GDD §2). */
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
/** Задержка перед автоматическим ходом отключившегося игрока (ADR-002). */
exports.DISCONNECT_GRACE_SECONDS = 5;
exports.RECONNECT_WINDOW_SECONDS = 60;
/** Следующий индекс по кругу. -1 на входе означает «активного ещё нет». */
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
 * После третьего броска игрок обязан записать очки (GDD: «Правило 3-го броска»).
 */
function isRollsExhausted(rollsLeft) {
    return rollsLeft <= 0;
}
/** Ход вернулся к первому игроку — раунд сменился. */
function isRoundComplete(nextIndex) {
    return nextIndex === 0;
}
