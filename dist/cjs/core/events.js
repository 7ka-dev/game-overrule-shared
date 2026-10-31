"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_LOG_EVENTS = void 0;
exports.appendEvent = appendEvent;
exports.nextEventSeq = nextEventSeq;
/** Number of recent events kept in the match state. */
exports.MAX_LOG_EVENTS = 30;
/**
 * Appends an event and trims the log to the limit: the oldest entries are
 * dropped so the state does not grow without bound.
 */
function appendEvent(events, event, limit = exports.MAX_LOG_EVENTS) {
    const next = [...events, event];
    return next.length > limit ? next.slice(next.length - limit) : next;
}
/** Next sequence number for a log entry. */
function nextEventSeq(events) {
    return (events.at(-1)?.seq ?? 0) + 1;
}
