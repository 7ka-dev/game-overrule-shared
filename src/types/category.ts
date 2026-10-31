// Категории согласно GDD
export type UpperCategory =
  | "Ones" // Младшие: 1,2,3 (по смыслу сумм по значениям)
  | "Twos"
  | "Threes"
  | "Fours" // Старшие: 4,5,6
  | "Fives"
  | "Sixes";

export type LowerCategory =
  | "FourOfAKind" // Четыре одинаковых? но GDD: Стрит — 4 последовательных (30), Фулл-хаус 3+2 (25), Ятци 5 одинаковых (50)
  | "SmallStraight" // Стрит — 4 последовательных
  | "LargeStraight" // не используется, но держим расширяемым
  | "FullHouse" // 3+2
  | "Yahtzee" // 5 одинаковых (Ятци)
  | "Chance";

export type WildChanceCategory = "WildChance"; // Дикий шанс — меняется каждый раунд

export type Category = UpperCategory | LowerCategory | WildChanceCategory;

export type ScoreValue = number | null; // null если не заполнена
