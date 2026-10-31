/**
 * Dice freeze rules (ADR-014/015).
 *
 * Forced locks (parity, selected face) always apply. On top of them, a player
 * may keep up to N dice manually when a `freeze-count` rule is active.
 */
export interface FreezeConfig {
    /** How many dice the player may keep manually (`null` means none). */
    count: number | "all" | null;
    /** Parity that is always kept. */
    parity: "even" | "odd" | null;
    /** Face that is always kept. */
    face: number | null;
}
interface RuleLike {
    aspect: string;
    value: string;
}
export declare function freezeConfig(rules: readonly RuleLike[]): FreezeConfig;
/** Dice that a rule keeps automatically. */
export declare function forcedDiceLocks(dice: readonly number[], config: FreezeConfig): boolean[];
/** Whether any freeze rule is active in this match. */
export declare function hasFreezeRules(config: FreezeConfig): boolean;
/** How many dice the player has already kept manually. */
export declare function countKept(kept: readonly boolean[]): number;
export {};
