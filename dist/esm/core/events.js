/** Number of recent events kept in the match state. */
export const MAX_LOG_EVENTS = 30;
/**
 * Appends an event and trims the log to the limit: the oldest entries are
 * dropped so the state does not grow without bound.
 */
export function appendEvent(events, event, limit = MAX_LOG_EVENTS) {
    const next = [...events, event];
    return next.length > limit ? next.slice(next.length - limit) : next;
}
/** Next sequence number for a log entry. */
export function nextEventSeq(events) {
    return (events.at(-1)?.seq ?? 0) + 1;
}
