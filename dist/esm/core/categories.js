/**
 * Категории MVP — классический лист Ятци без «4 одинаковых» и «большого стрита»:
 * GDD их не использует, а `scoreCategory` держит только для совместимости.
 *
 * Порядок важен: он задаёт вид таблицы очков и выбор при равенстве в Best Guess.
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
/** Свободные категории в порядке листа. */
export function availableCategories(taken) {
    const used = new Set(taken);
    return SCORE_CATEGORIES.filter((category) => !used.has(category));
}
/** Лист заполнен, когда заняты все категории MVP. */
export function isSheetComplete(taken) {
    const used = new Set(taken);
    return SCORE_CATEGORIES.every((category) => used.has(category));
}
