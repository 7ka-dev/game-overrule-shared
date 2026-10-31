export type UpperCategory = "Ones" | "Twos" | "Threes" | "Fours" | "Fives" | "Sixes";
export type LowerCategory = "FourOfAKind" | "SmallStraight" | "LargeStraight" | "FullHouse" | "Yahtzee" | "Chance";
export type WildChanceCategory = "WildChance";
export type Category = UpperCategory | LowerCategory | WildChanceCategory;
export type ScoreValue = number | null;
