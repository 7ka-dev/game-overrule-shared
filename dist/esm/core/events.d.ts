import type { GameLogEvent } from "../types/event.js";
/** Сколько последних событий держим в состоянии партии. */
export declare const MAX_LOG_EVENTS = 30;
/**
 * Добавляет событие и обрезает журнал до лимита: старые записи отбрасываются,
 * чтобы состояние не разрасталось.
 */
export declare function appendEvent(events: readonly GameLogEvent[], event: GameLogEvent, limit?: number): GameLogEvent[];
/** Следующий порядковый номер записи журнала. */
export declare function nextEventSeq(events: readonly GameLogEvent[]): number;
