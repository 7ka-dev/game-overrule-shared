export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceArray = [DiceValue, DiceValue, DiceValue, DiceValue, DiceValue];
export declare function isDiceValue(v: number): v is DiceValue;
export declare function createEmptyDice(): DiceArray;
