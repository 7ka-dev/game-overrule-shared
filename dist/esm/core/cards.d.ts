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
/** `turn-start-dice = previous`: inherit the previous player's final dice. */
export declare function turnStartsFromPreviousDice(rules: readonly ActiveRule[]): boolean;
/** `reroll-face-limit`: only dice of the selected face may be rerolled. */
export declare function hasRerollFaceLimit(rules: readonly ActiveRule[]): boolean;
export type HiddenDiceMode = "all" | "first-three";
export declare function hiddenDiceMode(rules: readonly ActiveRule[]): HiddenDiceMode | null;
/**
 * Client-side mask from ADR-020. Other players and spectators still see the
 * real dice; only the active player's own view is masked.
 */
export declare function hiddenDiceMask(rules: readonly ActiveRule[], diceCount: number, viewerIsActive: boolean): boolean[];
/**
 * Per-turn protocol limit.
 *
 * Default is 1. With `standings-card-limit`, a unique leader gets 0 and a
 * unique last player gets 2. Ties (including a tie for both places) keep the
 * default limit.
 */
export declare function maxCardsPerTurn(rules: readonly ActiveRule[], players: readonly StandingsPlayer[], sessionId: string): number;
