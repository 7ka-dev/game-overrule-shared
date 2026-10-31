import type { Category } from "../types/category.js";
/**
 * Категории MVP — классический лист Ятци без «4 одинаковых» и «большого стрита»:
 * GDD их не использует, а `scoreCategory` держит только для совместимости.
 *
 * Порядок важен: он задаёт вид таблицы очков и выбор при равенстве в Best Guess.
 */
export declare const SCORE_CATEGORIES: readonly Category[];
/** Свободные категории в порядке листа. */
export declare function availableCategories(taken: Iterable<Category>): Category[];
/** Лист заполнен, когда заняты все категории MVP. */
export declare function isSheetComplete(taken: Iterable<Category>): boolean;
