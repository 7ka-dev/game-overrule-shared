import type { Category, UpperCategory, LowerCategory } from "../types/category.js";
export declare function scoreCategory(dice: readonly number[], category: Category, wildChanceValue?: number): number;
export interface ScoreModifiers {
    /** Slots treated as jokers (wildcards). */
    wildDice?: readonly boolean[];
    /** Faces treated as jokers. */
    jokerFaces?: readonly number[];
    /** Invert faces during scoring: 1↔6, 2↔5, 3↔4. */
    invert?: boolean;
    /** Dice with the selected face multiply the total instead of adding to it. */
    dieMultiplierFace?: number | null;
}
/**
 * Scores a category with card rules applied (ADR-014).
 *
 * Inversion only changes the face values used for scoring; the rolled
 * combination is determined by the real dice (a straight remains a straight).
 * Base scores do not include roll bonuses; the engine applies those.
 */
export declare function scoreCategoryWithRules(dice: readonly number[], category: Category, modifiers?: ScoreModifiers): number;
export declare function scoreUpperCategories(dice: readonly number[]): Record<UpperCategory, number>;
export declare function getValidCategories(dice: readonly number[]): LowerCategory[];
