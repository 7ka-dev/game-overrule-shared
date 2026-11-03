import type { ScoreInversionMode } from "../types/card.js";
import type { Category, UpperCategory, LowerCategory } from "../types/category.js";
import { freezeConfig, frozenDiceCount } from "./freeze.js";
import { ruleNumber, ruleOf, type ActiveRule } from "./rules.js";
import { MAX_ROLLS } from "./turn.js";

type FrequencyMap = Record<number, number>;

function getFrequencies(dice: readonly number[]): FrequencyMap {
  const freq: FrequencyMap = {};
  for (let i = 0; i < dice.length; i++) {
    const v = dice[i] ?? 0;
    freq[v] = (freq[v] ?? 0) + 1;
  }
  return freq;
}

function sumDice(dice: readonly number[]): number {
  return dice.reduce((acc, v) => acc + v, 0);
}

const UPPER_VALUES: Partial<Record<Category, number>> = {
  Ones: 1,
  Twos: 2,
  Threes: 3,
  Fours: 4,
  Fives: 5,
  Sixes: 6,
};

// Straight of four consecutive values (GDD: "Straight: 4 consecutive values, 30 points")
function isSmallStraight(dice: readonly number[]): boolean {
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
    if (consecutive) return true;
  }
  return false;
}

function isFullHouse(dice: readonly number[]): boolean {
  const freq = getFrequencies(dice);
  const counts = Object.values(freq).sort((a, b) => b - a);
  // 3 + 2
  return counts.length === 2 && counts[0] === 3 && counts[1] === 2;
}

function isYahtzee(dice: readonly number[]): boolean {
  const freq = getFrequencies(dice);
  return Object.values(freq).some((c) => c >= 5);
}

function isLargeStraight(dice: readonly number[]): boolean {
  const unique = Array.from(new Set(dice)).sort((a, b) => a - b);
  for (let index = 0; index <= unique.length - 5; index += 1) {
    if ((unique[index + 4] ?? 0) - (unique[index] ?? 0) === 4) {
      return true;
    }
  }
  return false;
}

function hasFourOfAKind(dice: readonly number[]): boolean {
  return Object.values(getFrequencies(dice)).some((count) => count >= 4);
}

/**
 * Base score for a category.
 *
 * `actual` determines which combination was rolled (it cannot be changed by
 * inversion), while `values` contains the faces used for scoring.
 */
function scoreCategoryValues(
  actual: readonly number[],
  values: readonly number[],
  category: Category,
): number {
  const target = UPPER_VALUES[category];
  if (target !== undefined) {
    return actual.reduce(
      (acc, face, index) => (face === target ? acc + (values[index] ?? 0) : acc),
      0,
    );
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

export function scoreCategory(
  dice: readonly number[],
  category: Category,
  wildChanceValue?: number,
): number {
  if (category === "WildChance" && typeof wildChanceValue === "number") {
    return wildChanceValue;
  }
  return scoreCategoryValues(dice, dice, category);
}

export interface ScoreModifiers {
  /** Slots treated as jokers (wildcards). */
  wildDice?: readonly boolean[];
  /** Faces treated as jokers. */
  jokerFaces?: readonly number[];
  /** Invert faces during scoring: 1↔6, 2↔5, 3↔4. */
  invert?: boolean;
  /** Face transform during scoring; takes precedence over `invert`. */
  inversionMode?: ScoreInversionMode | null;
  /** Dice with the selected face multiply the total instead of adding to it. */
  dieMultiplierFace?: number | null;
}

export type ScoreSheet = Partial<Record<Category, number>>;

export interface ScorePlayerContext {
  sheet: ScoreSheet;
}

export interface ScorePlayerRuntime {
  wildDice?: readonly boolean[];
  keepDice?: readonly boolean[];
  hasRolled?: boolean;
  rollsLeft?: number;
  turnRolls?: number;
  turnPenalty?: number;
}

/** Everything needed to calculate one category score (shared server/client). */
export interface ScoreContext {
  dice: readonly number[];
  category: Category;
  rules: readonly ActiveRule[];
  player: ScorePlayerContext & ScorePlayerRuntime;
  allPlayers?: readonly ScorePlayerContext[];
  /** Category closed by the previous turn, for repeat-category-double. */
  previousCategory?: Category | null;
  /** First category closed in the round, for round-suit. */
  roundSuitCategory?: Category | null;
}

/** Reads the active face transform. A legacy empty value means inversion. */
export function scoreInversionMode(rules: readonly ActiveRule[]): ScoreInversionMode | null {
  const rule = ruleOf(rules, "score-inversion");
  if (!rule) {
    return null;
  }
  if (rule.value === "shift-up" || rule.value === "shift-down") {
    return rule.value;
  }
  return "invert";
}

function transformFace(value: number, mode: ScoreInversionMode | null): number {
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

function applyDieMultiplier(
  dice: readonly number[],
  category: Category,
  face: number,
  base: number,
): number {
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
export function scoreCategoryWithRules(
  dice: readonly number[],
  category: Category,
  modifiers: ScoreModifiers = {},
): number {
  const inversion = modifiers.inversionMode ?? (modifiers.invert === true ? "invert" : null);
  const values = dice.map((value) => transformFace(value, inversion));

  const wildIndices: number[] = [];
  for (let index = 0; index < dice.length; index += 1) {
    const isWild =
      modifiers.wildDice?.[index] === true ||
      (modifiers.jokerFaces?.includes(dice[index] ?? 0) ?? false);
    if (isWild) {
      wildIndices.push(index);
    }
  }

  let bestScore = -1;
  const candidateActual = [...dice];
  const candidateValues = [...values];
  const scoreAssignments = (wildIndex: number): void => {
    if (wildIndex === wildIndices.length) {
      bestScore = Math.max(
        bestScore,
        scoreCategoryValues(candidateActual, candidateValues, category),
      );
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
    candidateActual[dieIndex] = dice[dieIndex]!;
    candidateValues[dieIndex] = values[dieIndex]!;
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
export function scoreWithRules(context: ScoreContext): number {
  const { dice, category, rules, player } = context;
  const allPlayers = context.allPlayers ?? [];

  const jokerFaces = rules
    .filter((rule) => rule.aspect === "joker-face")
    .map((rule) => Number(rule.value));
  const dieMultiplier = ruleOf(rules, "die-multiplier");

  let score = scoreCategoryWithRules(dice, category, {
    wildDice: player.wildDice,
    jokerFaces,
    inversionMode: scoreInversionMode(rules),
    dieMultiplierFace: dieMultiplier !== undefined ? Number(dieMultiplier.value) : null,
  });

  if (ruleOf(rules, "seven-triple") && score === 7) {
    score = 21;
  }

  const turnRolls = player.turnRolls ?? MAX_ROLLS;
  const isFirstRoll =
    player.hasRolled === true && player.rollsLeft === turnRolls - 1;
  let multiplier = 1;
  if (ruleOf(rules, "first-roll-double") && isFirstRoll) {
    multiplier *= 2;
  }
  if (ruleOf(rules, "target-category-double")?.value === category) {
    multiplier *= 2;
  }
  if (
    ruleOf(rules, "repeat-category-double") &&
    context.previousCategory === category
  ) {
    multiplier *= 2;
  }
  const roundSuit = ruleOf(rules, "round-suit")
    ? context.roundSuitCategory ?? null
    : null;
  if (roundSuit === category) {
    multiplier *= 2;
  }
  score *= multiplier;

  // "All rolls used" is a relative +50% bonus, so it belongs to the additive
  // stage after multipliers rather than to the fixed base score.
  if (ruleOf(rules, "all-rolls-bonus") && player.rollsLeft === 0) {
    score = Math.round(score * 1.5);
  }

  const taken = allPlayers.some((entry) => entry.sheet[category] !== undefined);
  const takenBonus = ruleOf(rules, "taken-category-bonus");
  if (taken && takenBonus) {
    score += ruleNumber(takenBonus, 6);
  }

  const cap = ruleOf(rules, "category-cap");
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

  const takenPenalty = ruleOf(rules, "taken-category-penalty");
  if (taken && takenPenalty) {
    score -= ruleNumber(takenPenalty, 3);
  }

  if (roundSuit && roundSuit !== category) {
    score -= 5;
  }

  const frozenPenalty = ruleOf(rules, "frozen-penalty");
  if (frozenPenalty) {
    score -=
      frozenDiceCount(dice, player.keepDice ?? [], freezeConfig(rules)) *
      ruleNumber(frozenPenalty, 1);
  }

  score -= player.turnPenalty ?? 0;
  return Math.max(0, score);
}

export function scoreUpperCategories(dice: readonly number[]): Record<UpperCategory, number> {
  return {
    Ones: scoreCategory(dice, "Ones"),
    Twos: scoreCategory(dice, "Twos"),
    Threes: scoreCategory(dice, "Threes"),
    Fours: scoreCategory(dice, "Fours"),
    Fives: scoreCategory(dice, "Fives"),
    Sixes: scoreCategory(dice, "Sixes"),
  };
}

export function getValidCategories(dice: readonly number[]): LowerCategory[] {
  const valid: LowerCategory[] = [];
  if (isSmallStraight(dice)) valid.push("SmallStraight");
  if (isFullHouse(dice)) valid.push("FullHouse");
  if (isYahtzee(dice)) valid.push("Yahtzee");
  valid.push("Chance");
  return valid;
}
