import type { DiceArray } from "./dice.js";
import type { Card } from "./card.js";
import type { Category, ScoreValue } from "./category.js";
export type PlayerId = string;
export interface PlayerState {
    id: PlayerId;
    name: string;
    dice: DiceArray;
    rollsLeft: number;
    hand: Card[];
    scoreSheet: Record<Category, ScoreValue>;
    hasDisconnected: boolean;
    autoPlayed: boolean;
}
