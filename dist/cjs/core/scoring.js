"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreCategory = scoreCategory;
exports.scoreInversionMode = scoreInversionMode;
exports.scoreCategoryWithRules = scoreCategoryWithRules;
exports.scoreWithRules = scoreWithRules;
exports.scoreUpperCategories = scoreUpperCategories;
exports.getValidCategories = getValidCategories;
const freeze_js_1 = require("./freeze.js");
const rules_js_1 = require("./rules.js");
const turn_js_1 = require("./turn.js");
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
// Straight of four consecutive values (GDD: "Straight: 4 consecutive values, 30 points")
function isSmallStraight(dice) {
    const unique = Array.from(new Set(dice)).sort((a, b) => a - b);
    // Check whether any four consecutive values are present
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
    // 3 + 2
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
 * Base score for a category.
 *
 * `actual` determines which combination was rolled (it cannot be changed by
 * inversion), while `values` contains the faces used for scoring.
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
function scoreCategory(dice, category, wildChanceValue) {
    if (category === "WildChance" && typeof wildChanceValue === "number") {
        return wildChanceValue;
    }
    return scoreCategoryValues(dice, dice, category);
}
/** Reads the active face transform. A legacy empty value means inversion. */
function scoreInversionMode(rules) {
    const rule = (0, rules_js_1.ruleOf)(rules, "score-inversion");
    if (!rule) {
        return null;
    }
    if (rule.value === "shift-up" || rule.value === "shift-down") {
        return rule.value;
    }
    return "invert";
}
function transformFace(value, mode) {
    switch (mode) {
        case "shift-up":
            return value === 6 ? 1 : value + 1;
        case "shift-down":
            return value === 1 ? 6 : value - 1;
        case "invert":
            return 7 - value;
        default:
            return value;
    }
}
function applyDieMultiplier(dice, category, face, base) {
    if (base <= 0) {
        return base;
    }
    const target = UPPER_VALUES[category];
    const sumsAll = category === "Chance";
    if (target === undefined && !sumsAll) {
        // For fixed combinations the die counts if the combination is complete
        // and contains a die with the selected face.
        return dice.includes(face) ? base * 2 : base;
    }
    if (target !== undefined && face !== target) {
        return base;
    }
    // The first die with the selected face multiplies the total instead of
    // adding its value. Other dice with the same face are added as usual.
    const index = dice.findIndex((value) => value === face);
    if (index === -1) {
        return base;
    }
    return Math.max(0, base - face) * face;
}
/**
 * Scores a category with card rules applied (ADR-014).
 *
 * Inversion only changes the face values used for scoring; the rolled
 * combination is determined by the real dice (a straight remains a straight).
 * Base scores do not include roll bonuses; the engine applies those.
 */
function scoreCategoryWithRules(dice, category, modifiers = {}) {
    const inversion = modifiers.inversionMode ?? (modifiers.invert === true ? "invert" : null);
    const values = dice.map((value) => transformFace(value, inversion));
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
            candidateValues[dieIndex] = transformFace(face, inversion);
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
/**
 * Full score pipeline, shared by the server and the client preview.
 *
 * Order: base → face transform → fixed bonuses → multipliers → additive
 * bonuses → category cap → penalties → personal penalty → max(0).
 */
function scoreWithRules(context) {
    const { dice, category, rules, player } = context;
    const allPlayers = context.allPlayers ?? [];
    const jokerFaces = rules
        .filter((rule) => rule.aspect === "joker-face")
        .map((rule) => Number(rule.value));
    const dieMultiplier = (0, rules_js_1.ruleOf)(rules, "die-multiplier");
    let score = scoreCategoryWithRules(dice, category, {
        wildDice: player.wildDice,
        jokerFaces,
        inversionMode: scoreInversionMode(rules),
        dieMultiplierFace: dieMultiplier !== undefined ? Number(dieMultiplier.value) : null,
    });
    if ((0, rules_js_1.ruleOf)(rules, "seven-triple") && score === 7) {
        score = 21;
    }
    const turnRolls = player.turnRolls ?? turn_js_1.MAX_ROLLS;
    const isFirstRoll = player.hasRolled === true && player.rollsLeft === turnRolls - 1;
    let multiplier = 1;
    if ((0, rules_js_1.ruleOf)(rules, "first-roll-double") && isFirstRoll) {
        multiplier *= 2;
    }
    if ((0, rules_js_1.ruleOf)(rules, "target-category-double")?.value === category) {
        multiplier *= 2;
    }
    if ((0, rules_js_1.ruleOf)(rules, "repeat-category-double") &&
        context.previousCategory === category) {
        multiplier *= 2;
    }
    const roundSuit = (0, rules_js_1.ruleOf)(rules, "round-suit")
        ? context.roundSuitCategory ?? null
        : null;
    if (roundSuit === category) {
        multiplier *= 2;
    }
    score *= multiplier;
    // "All rolls used" is a relative +50% bonus, so it belongs to the additive
    // stage after multipliers rather than to the fixed base score.
    if ((0, rules_js_1.ruleOf)(rules, "all-rolls-bonus") && player.rollsLeft === 0) {
        score = Math.round(score * 1.5);
    }
    const taken = allPlayers.some((entry) => entry.sheet[category] !== undefined);
    const takenBonus = (0, rules_js_1.ruleOf)(rules, "taken-category-bonus");
    if (taken && takenBonus) {
        score += (0, rules_js_1.ruleNumber)(takenBonus, 6);
    }
    const cap = (0, rules_js_1.ruleOf)(rules, "category-cap");
    if (cap?.value === "best-recorded") {
        let best = -Infinity;
        for (const entry of allPlayers) {
            const recorded = entry.sheet[category];
            if (recorded !== undefined) {
                best = Math.max(best, recorded);
            }
        }
        if (best !== -Infinity) {
            score = Math.min(score, best);
        }
    }
    const takenPenalty = (0, rules_js_1.ruleOf)(rules, "taken-category-penalty");
    if (taken && takenPenalty) {
        score -= (0, rules_js_1.ruleNumber)(takenPenalty, 3);
    }
    if (roundSuit && roundSuit !== category) {
        score -= 5;
    }
    const frozenPenalty = (0, rules_js_1.ruleOf)(rules, "frozen-penalty");
    if (frozenPenalty) {
        score -=
            (0, freeze_js_1.frozenDiceCount)(dice, player.keepDice ?? [], (0, freeze_js_1.freezeConfig)(rules)) *
                (0, rules_js_1.ruleNumber)(frozenPenalty, 1);
    }
    score -= player.turnPenalty ?? 0;
    return Math.max(0, score);
}
function scoreUpperCategories(dice) {
    return {
        Ones: scoreCategory(dice, "Ones"),
        Twos: scoreCategory(dice, "Twos"),
        Threes: scoreCategory(dice, "Threes"),
        Fours: scoreCategory(dice, "Fours"),
        Fives: scoreCategory(dice, "Fives"),
        Sixes: scoreCategory(dice, "Sixes"),
    };
}
function getValidCategories(dice) {
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
