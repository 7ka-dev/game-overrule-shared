"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardTiming = cardTiming;
exports.cardLockRound = cardLockRound;
exports.maxCardsPerTurn = maxCardsPerTurn;
const rules_js_1 = require("./rules.js");
/** `card-timing = before-roll`: cards may only be played before the first roll. */
function cardTiming(rules) {
    const rule = (0, rules_js_1.ruleOf)(rules, "card-timing");
    return rule?.value === "before-roll" ? "before-roll" : null;
}
/** `card-lock-round = N`: no cards while the current round is <= N. */
function cardLockRound(rules) {
    const rule = (0, rules_js_1.ruleOf)(rules, "card-lock-round");
    if (!rule) {
        return null;
    }
    const value = (0, rules_js_1.ruleNumber)(rule, 0);
    return Number.isInteger(value) && value > 0 ? value : null;
}
/**
 * Per-turn protocol limit.
 *
 * Default is 1. With `standings-card-limit`, a unique leader gets 0 and a
 * unique last player gets 2. Ties (including a tie for both places) keep the
 * default limit.
 */
function maxCardsPerTurn(rules, players, sessionId) {
    if (!(0, rules_js_1.ruleOf)(rules, "standings-card-limit") || players.length < 2) {
        return 1;
    }
    const scores = players.map((player) => player.score);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const leaders = players.filter((player) => player.score === highest);
    const lastPlayers = players.filter((player) => player.score === lowest);
    if (leaders.length === 1 && leaders[0]?.sessionId === sessionId) {
        return 0;
    }
    if (lastPlayers.length === 1 && lastPlayers[0]?.sessionId === sessionId) {
        return 2;
    }
    return 1;
}
