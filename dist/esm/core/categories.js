/**
 * MVP categories: the classic Yahtzee sheet without "four of a kind" and
 * "large straight". The GDD does not use them; `scoreCategory` keeps them
 * only for compatibility.
 *
 * Order matters: it defines the score table layout and tie-breaking in
 * Best Guess.
 */
export const SCORE_CATEGORIES = [
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
export function availableCategories(taken) {
    const used = new Set(taken);
    return SCORE_CATEGORIES.filter((category) => !used.has(category));
}
/** The sheet is complete when every MVP category is filled. */
export function isSheetComplete(taken) {
    const used = new Set(taken);
    return SCORE_CATEGORIES.every((category) => used.has(category));
}
