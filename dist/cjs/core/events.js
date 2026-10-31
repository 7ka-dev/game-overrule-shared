"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_LOG_EVENTS = void 0;
exports.appendEvent = appendEvent;
exports.nextEventSeq = nextEventSeq;
/** Сколько последних событий держим в состоянии партии. */
exports.MAX_LOG_EVENTS = 30;
/**
 * Добавляет событие и обрезает журнал до лимита: старые записи отбрасываются,
 * чтобы состояние не разрасталось.
 */
function appendEvent(events, event, limit = exports.MAX_LOG_EVENTS) {
    const next = [...events, event];
    return next.length > limit ? next.slice(next.length - limit) : next;
}
/** Следующий порядковый номер записи журнала. */
function nextEventSeq(events) {
    return (events.at(-1)?.seq ?? 0) + 1;
}
