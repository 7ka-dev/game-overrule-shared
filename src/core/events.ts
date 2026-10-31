import type { GameLogEvent } from "../types/event.js";

/** Сколько последних событий держим в состоянии партии. */
export const MAX_LOG_EVENTS = 30;

/**
 * Добавляет событие и обрезает журнал до лимита: старые записи отбрасываются,
 * чтобы состояние не разрасталось.
 */
export function appendEvent(
  events: readonly GameLogEvent[],
  event: GameLogEvent,
  limit = MAX_LOG_EVENTS,
): GameLogEvent[] {
  const next = [...events, event];
  return next.length > limit ? next.slice(next.length - limit) : next;
}

/** Следующий порядковый номер записи журнала. */
export function nextEventSeq(events: readonly GameLogEvent[]): number {
  return (events.at(-1)?.seq ?? 0) + 1;
}
