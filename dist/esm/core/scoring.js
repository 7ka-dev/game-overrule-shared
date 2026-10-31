function getFrequencies(dice) {
    const freq = {};
    for (let i = 0; i < dice.length; i++) {
        const v = dice[i] ?? 0;
        freq[v] = (freq[v] ?? 0) + 1;
    }
    return freq;
}
function sumDice(dice) {
    return dice.reduce((acc, v) => acc + v, 0);
}
const UPPER_VALUES = {
    Ones: 1,
    Twos: 2,
    Threes: 3,
    Fours: 4,
    Fives: 5,
    Sixes: 6,
};
// Стрит из 4 последовательных (как в GDD: "Стрит — 4 последовательных значения (30 очков)")
function isSmallStraight(dice) {
    const unique = Array.from(new Set(dice)).sort((a, b) => a - b);
    // Проверяем наличие последовательности из 4
    for (let i = 0; i <= unique.length - 4; i++) {
        let consecutive = true;
        for (let j = 0; j < 3; j++) {
            if (unique[i + j + 1] !== unique[i + j] + 1) {
                consecutive = false;
                break;
            }
        }
        if (consecutive)
            return true;
    }
    return false;
}
function isFullHouse(dice) {
    const freq = getFrequencies(dice);
    const counts = Object.values(freq).sort((a, b) => b - a);
    // 3+2
    return counts.length === 2 && counts[0] === 3 && counts[1] === 2;
}
function isYahtzee(dice) {
    const freq = getFrequencies(dice);
    return Object.values(freq).some((c) => c >= 5);
}
function isLargeStraight(dice) {
    const unique = Array.from(new Set(dice)).sort((a, b) => a - b);
    for (let index = 0; index <= unique.length - 5; index += 1) {
        if ((unique[index + 4] ?? 0) - (unique[index] ?? 0) === 4) {
            return true;
        }
    }
    return false;
}
function hasFourOfAKind(dice) {
    return Object.values(getFrequencies(dice)).some((count) => count >= 4);
}
/**
 * Базовые очки категории.
 *
 * `actual` определяет, какая комбинация выпала (её нельзя «подменить»
 * инверсией), а `values` — значения граней для начисления очков.
 */
function scoreCategoryValues(actual, values, category) {
    const target = UPPER_VALUES[category];
    if (target !== undefined) {
        return actual.reduce((acc, face, index) => (face === target ? acc + (values[index] ?? 0) : acc), 0);
    }
    switch (category) {
        case "SmallStraight":
            return isSmallStraight(actual) ? 30 : 0;
        case "FullHouse":
            return isFullHouse(actual) ? 25 : 0;
        case "Yahtzee":
            return isYahtzee(actual) ? 50 : 0;
        case "Chance":
        case "WildChance":
            return sumDice(values);
        case "LargeStraight":
            return isLargeStraight(actual) ? 40 : 0;
        case "FourOfAKind":
            return hasFourOfAKind(actual) ? sumDice(values) : 0;
        default:
            return 0;
    }
}
export function scoreCategory(dice, category, wildChanceValue) {
    if (category === "WildChance" && typeof wildChanceValue === "number") {
        return wildChanceValue;
    }
    return scoreCategoryValues(dice, dice, category);
}
function applyDieMultiplier(dice, category, face, base) {
    if (base <= 0) {
        return base;
    }
    const target = UPPER_VALUES[category];
    const sumsAll = category === "Chance";
    if (target === undefined && !sumsAll) {
        // Для фиксированных комбинаций кубик «идёт в зачёт», если комбинация
        // собрана и в ней есть кубик с выбранной гранью.
        return dice.includes(face) ? base * 2 : base;
    }
    if (target !== undefined && face !== target) {
        return base;
    }
    // Умножает первый кубик с выбранной гранью: его вклад заменяется
    // умножением итога. Остальные кубики с той же гранью складываются обычно.
    const index = dice.findIndex((value) => value === face);
    if (index === -1) {
        return base;
    }
    return Math.max(0, base - face) * face;
}
/**
 * Подсчёт очков с учётом карточных правил (ADR-014).
 *
 * Инверсия меняет только значения граней для начисления очков; выпавшая
 * комбинация определяется реальными кубиками (стрит остаётся стритом).
 * Базовые очки не включают бонусы за бросок — они начисляются в движке.
 */
export function scoreCategoryWithRules(dice, category, modifiers = {}) {
    const inverted = modifiers.invert === true;
    const values = inverted ? dice.map((value) => 7 - value) : [...dice];
    const wildIndices = [];
    for (let index = 0; index < dice.length; index += 1) {
        const isWild = modifiers.wildDice?.[index] === true ||
            (modifiers.jokerFaces?.includes(dice[index] ?? 0) ?? false);
        if (isWild) {
            wildIndices.push(index);
        }
    }
    let bestScore = -1;
    const candidateActual = [...dice];
    const candidateValues = [...values];
    const scoreAssignments = (wildIndex) => {
        if (wildIndex === wildIndices.length) {
            bestScore = Math.max(bestScore, scoreCategoryValues(candidateActual, candidateValues, category));
            return;
        }
        const dieIndex = wildIndices[wildIndex];
        if (dieIndex === undefined) {
            return;
        }
        for (let face = 1; face <= 6; face += 1) {
            candidateActual[dieIndex] = face;
            candidateValues[dieIndex] = inverted ? 7 - face : face;
            scoreAssignments(wildIndex + 1);
        }
        candidateActual[dieIndex] = dice[dieIndex];
        candidateValues[dieIndex] = values[dieIndex];
    };
    scoreAssignments(0);
    const base = Math.max(0, bestScore);
    if (modifiers.dieMultiplierFace !== null && modifiers.dieMultiplierFace !== undefined) {
        return applyDieMultiplier(dice, category, modifiers.dieMultiplierFace, base);
    }
    return base;
}
export function scoreUpperCategories(dice) {
    return {
        Ones: scoreCategory(dice, "Ones"),
        Twos: scoreCategory(dice, "Twos"),
        Threes: scoreCategory(dice, "Threes"),
        Fours: scoreCategory(dice, "Fours"),
        Fives: scoreCategory(dice, "Fives"),
        Sixes: scoreCategory(dice, "Sixes"),
    };
}
export function getValidCategories(dice) {
    const valid = [];
    if (isSmallStraight(dice))
        valid.push("SmallStraight");
    if (isFullHouse(dice))
        valid.push("FullHouse");
    if (isYahtzee(dice))
        valid.push("Yahtzee");
    valid.push("Chance");
    return valid;
}
