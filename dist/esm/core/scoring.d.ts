import type { ScoreInversionMode } from "../types/card.js";
import type { Category, UpperCategory, LowerCategory } from "../types/category.js";
import { type ActiveRule } from "./rules.js";
export declare function scoreCategory(dice: readonly number[], category: Category, wildChanceValue?: number): number;
export interface ScoreModifiers {
    /** Slots treated as jokers (wildcards). */
    wildDice?: readonly boolean[];
    /** Faces treated as jokers. */
    jokerFaces?: readonly number[];
    /** Invert faces during scoring: 1↔6, 2↔5, 3↔4. */
    invert?: boolean;
    /** Face transform during scoring; takes precedence over `invert`. */
    inversionMode?: ScoreInversionMode | null;
    /** Dice with the selected face multiply the total instead of adding to it. */
    dieMultiplierFace?: number | null;
}
export type ScoreSheet = Partial<Record<Category, number>>;
export interface ScorePlayerContext {
    sheet: ScoreSheet;
}
export interface ScorePlayerRuntime {
    wildDice?: readonly boolean[];
    keepDice?: readonly boolean[];
    hasRolled?: boolean;
    rollsLeft?: number;
    turnRolls?: number;
    turnPenalty?: number;
}
/** Everything needed to calculate one category score (shared server/client). */
export interface ScoreContext {
    dice: readonly number[];
    category: Category;
    rules: readonly ActiveRule[];
    player: ScorePlayerContext & ScorePlayerRuntime;
    allPlayers?: readonly ScorePlayerContext[];
    /** Category closed by the previous turn, for repeat-category-double. */
    previousCategory?: Category | null;
    /** First category closed in the round, for round-suit. */
    roundSuitCategory?: Category | null;
}
/** Reads the active face transform. A legacy empty value means inversion. */
export declare function scoreInversionMode(rules: readonly ActiveRule[]): ScoreInversionMode | null;
/**
 * Scores a category with card rules applied (ADR-014).
 *
 * Inversion only changes the face values used for scoring; the rolled
 * combination is determined by the real dice (a straight remains a straight).
 * Base scores do not include roll bonuses; the engine applies those.
 */
export declare function scoreCategoryWithRules(dice: readonly number[], category: Category, modifiers?: ScoreModifiers): number;
/**
 * Full score pipeline, shared by the server and the client preview.
 *
 * Order: base → face transform → fixed bonuses → multipliers → additive
 * bonuses → category cap → penalties → personal penalty → max(0).
 */
export declare function scoreWithRules(context: ScoreContext): number;
export declare function scoreUpperCategories(dice: readonly number[]): Record<UpperCategory, number>;
export declare function getValidCategories(dice: readonly number[]): LowerCategory[];
