import { type ActiveRule } from "./rules.js";
/**
 * Card-control rules (ADR-018, ADR-022).
 *
 * These helpers are shared by the authoritative engine and the client so both
 * sides agree on whether a protocol can be played.
 */
export interface StandingsPlayer {
    sessionId: string;
    score: number;
}
/** `card-timing = before-roll`: cards may only be played before the first roll. */
export declare function cardTiming(rules: readonly ActiveRule[]): "before-roll" | null;
/** `card-lock-round = N`: no cards while the current round is <= N. */
export declare function cardLockRound(rules: readonly ActiveRule[]): number | null;
/**
 * Per-turn protocol limit.
 *
 * Default is 1. With `standings-card-limit`, a unique leader gets 0 and a
 * unique last player gets 2. Ties (including a tie for both places) keep the
 * default limit.
 */
export declare function maxCardsPerTurn(rules: readonly ActiveRule[], players: readonly StandingsPlayer[], sessionId: string): number;
