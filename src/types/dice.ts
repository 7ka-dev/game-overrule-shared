export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export type DiceArray = [DiceValue, DiceValue, DiceValue, DiceValue, DiceValue];

export function isDiceValue(v: number): v is DiceValue {
  return Number.isInteger(v) && v >= 1 && v <= 6;
}

export function createEmptyDice(): DiceArray {
  return [1, 1, 1, 1, 1];
}