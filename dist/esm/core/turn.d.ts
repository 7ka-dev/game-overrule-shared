/**
 * Правила хода. Чистые функции — тестируются без Colyseus и без UI.
 */
/** Максимум бросков за ход (GDD §2). */
export declare const MAX_ROLLS = 3;
/** Длительность хода одного игрока, секунды (GDD §2). */
export declare const TURN_SECONDS = 20;
export declare const MIN_TURN_SECONDS = 10;
export declare const MAX_TURN_SECONDS = 60;
export declare function isValidTurnDuration(seconds: unknown): seconds is number;
/** Applies a card adjustment without exceeding the room's configured turn budget. */
export declare function adjustTurnSeconds(currentSeconds: number, deltaSeconds: number, maxSeconds: number): number;
/** Задержка перед автоматическим ходом отключившегося игрока (ADR-002). */
export declare const DISCONNECT_GRACE_SECONDS = 5;
export declare const RECONNECT_WINDOW_SECONDS = 60;
/** Следующий индекс по кругу. -1 на входе означает «активного ещё нет». */
export declare function nextPlayerIndex(currentIndex: number, playerCount: number): number;
/**
 * После третьего броска игрок обязан записать очки (GDD: «Правило 3-го броска»).
 */
export declare function isRollsExhausted(rollsLeft: number): boolean;
/** Ход вернулся к первому игроку — раунд сменился. */
export declare function isRoundComplete(nextIndex: number): boolean;
