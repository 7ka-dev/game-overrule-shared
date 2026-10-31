/**
 * Правила хода. Чистые функции — тестируются без Colyseus и без UI.
 */
/** Максимум бросков за ход (GDD §2). */
export const MAX_ROLLS = 3;
/** Длительность хода одного игрока, секунды (GDD §2). */
export const TURN_SECONDS = 20;
export const MIN_TURN_SECONDS = 10;
export const MAX_TURN_SECONDS = 60;
export function isValidTurnDuration(seconds) {
    return (typeof seconds === "number" &&
        Number.isInteger(seconds) &&
        seconds >= MIN_TURN_SECONDS &&
        seconds <= MAX_TURN_SECONDS);
}
/** Applies a card adjustment without exceeding the room's configured turn budget. */
export function adjustTurnSeconds(currentSeconds, deltaSeconds, maxSeconds) {
    return Math.min(maxSeconds, Math.max(0, currentSeconds + deltaSeconds));
}
/** Задержка перед автоматическим ходом отключившегося игрока (ADR-002). */
export const DISCONNECT_GRACE_SECONDS = 5;
export const RECONNECT_WINDOW_SECONDS = 60;
/** Следующий индекс по кругу. -1 на входе означает «активного ещё нет». */
export function nextPlayerIndex(currentIndex, playerCount) {
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
export function isRollsExhausted(rollsLeft) {
    return rollsLeft <= 0;
}
/** Ход вернулся к первому игроку — раунд сменился. */
export function isRoundComplete(nextIndex) {
    return nextIndex === 0;
}
