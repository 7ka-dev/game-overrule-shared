"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCORE_CATEGORIES = void 0;
exports.availableCategories = availableCategories;
exports.isSheetComplete = isSheetComplete;
/**
 * Категории MVP — классический лист Ятци без «4 одинаковых» и «большого стрита»:
 * GDD их не использует, а `scoreCategory` держит только для совместимости.
 *
 * Порядок важен: он задаёт вид таблицы очков и выбор при равенстве в Best Guess.
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
/** Свободные категории в порядке листа. */
function availableCategories(taken) {
    const used = new Set(taken);
    return exports.SCORE_CATEGORIES.filter((category) => !used.has(category));
}
/** Лист заполнен, когда заняты все категории MVP. */
function isSheetComplete(taken) {
    const used = new Set(taken);
    return exports.SCORE_CATEGORIES.every((category) => used.has(category));
}
