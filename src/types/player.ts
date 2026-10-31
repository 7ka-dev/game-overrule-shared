import type { DiceArray } from "./dice.js";
import type { Card } from "./card.js";
import type { Category, ScoreValue } from "./category.js";

export type PlayerId = string;

export interface PlayerState {
  id: PlayerId;
  name: string;
  dice: DiceArray;
  rollsLeft: number; // 3,2,1,0
  hand: Card[]; // макс 4
  scoreSheet: Record<Category, ScoreValue>;
  hasDisconnected: boolean;
  autoPlayed: boolean;
}
