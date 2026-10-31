import type { Category, UpperCategory, LowerCategory } from "../types/category.js";

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
  /** Dice with the selected face multiply the total instead of adding to it. */
  dieMultiplierFace?: number | null;
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
  const inverted = modifiers.invert === true;
  const values = inverted ? dice.map((value) => 7 - value) : [...dice];

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
      candidateValues[dieIndex] = inverted ? 7 - face : face;
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
