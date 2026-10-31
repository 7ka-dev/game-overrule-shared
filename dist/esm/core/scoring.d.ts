import type { Category, UpperCategory, LowerCategory } from "../types/category.js";
export declare function scoreCategory(dice: readonly number[], category: Category, wildChanceValue?: number): number;
export interface ScoreModifiers {
    /** Слоты, которые считаются джокерами (wildcard). */
    wildDice?: readonly boolean[];
    /** Грани, которые считаются джокерами. */
    jokerFaces?: readonly number[];
    /** Инверсия граней при подсчёте: 1↔6, 2↔5, 3↔4. */
    invert?: boolean;
    /** Кубики с выбранной гранью умножают итог вместо сложения. */
    dieMultiplierFace?: number | null;
}
/**
 * Подсчёт очков с учётом карточных правил (ADR-014).
 *
 * Инверсия меняет только значения граней для начисления очков; выпавшая
 * комбинация определяется реальными кубиками (стрит остаётся стритом).
 * Базовые очки не включают бонусы за бросок — они начисляются в движке.
 */
export declare function scoreCategoryWithRules(dice: readonly number[], category: Category, modifiers?: ScoreModifiers): number;
export declare function scoreUpperCategories(dice: readonly number[]): Record<UpperCategory, number>;
export declare function getValidCategories(dice: readonly number[]): LowerCategory[];
