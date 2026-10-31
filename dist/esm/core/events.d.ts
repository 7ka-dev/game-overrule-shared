import type { GameLogEvent } from "../types/event.js";
/** Number of recent events kept in the match state. */
export declare const MAX_LOG_EVENTS = 30;
/**
 * Appends an event and trims the log to the limit: the oldest entries are
 * dropped so the state does not grow without bound.
 */
export declare function appendEvent(events: readonly GameLogEvent[], event: GameLogEvent, limit?: number): GameLogEvent[];
/** Next sequence number for a log entry. */
export declare function nextEventSeq(events: readonly GameLogEvent[]): number;
