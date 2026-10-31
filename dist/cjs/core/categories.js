"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCORE_CATEGORIES = void 0;
exports.availableCategories = availableCategories;
exports.isSheetComplete = isSheetComplete;
/**
 * MVP categories: the classic Yahtzee sheet without "four of a kind" and
 * "large straight". The GDD does not use them; `scoreCategory` keeps them
 * only for compatibility.
 *
 * Order matters: it defines the score table layout and tie-breaking in
 * Best Guess.
 */
exports.SCORE_CATEGORIES = [
    "Ones",
    "Twos",
    "Threes",
    "Fours",
    "Fives",
    "Sixes",
    "SmallStraight",
    "FullHouse",
    "Yahtzee",
    "Chance",
];
/** Available categories in sheet order. */
function availableCategories(taken) {
    const used = new Set(taken);
    return exports.SCORE_CATEGORIES.filter((category) => !used.has(category));
}
/** The sheet is complete when every MVP category is filled. */
function isSheetComplete(taken) {
    const used = new Set(taken);
    return exports.SCORE_CATEGORIES.every((category) => used.has(category));
}
