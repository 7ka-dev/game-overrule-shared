// Categories according to the GDD.
export type UpperCategory =
  | "Ones" // lower values: 1, 2, 3 (sum of matching faces)
  | "Twos"
  | "Threes"
  | "Fours" // higher values: 4, 5, 6
  | "Fives"
  | "Sixes";

export type LowerCategory =
  | "FourOfAKind" // four of a kind; kept for compatibility, not used by the MVP sheet
  | "SmallStraight" // four consecutive values
  | "LargeStraight" // not used, kept for future extension
  | "FullHouse" // 3 + 2
  | "Yahtzee" // five of a kind
  | "Chance";

export type WildChanceCategory = "WildChance"; // wild chance, changes every round

export type Category = UpperCategory | LowerCategory | WildChanceCategory;

export type ScoreValue = number | null; // null when the category is not filled
