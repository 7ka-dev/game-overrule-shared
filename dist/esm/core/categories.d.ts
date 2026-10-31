import type { Category } from "../types/category.js";
/**
 * MVP categories: the classic Yahtzee sheet without "four of a kind" and
 * "large straight". The GDD does not use them; `scoreCategory` keeps them
 * only for compatibility.
 *
 * Order matters: it defines the score table layout and tie-breaking in
 * Best Guess.
 */
export declare const SCORE_CATEGORIES: readonly Category[];
/** Available categories in sheet order. */
export declare function availableCategories(taken: Iterable<Category>): Category[];
/** The sheet is complete when every MVP category is filled. */
export declare function isSheetComplete(taken: Iterable<Category>): boolean;
