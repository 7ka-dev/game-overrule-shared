import type { DiceArray } from "./dice.js";
import type { Card } from "./card.js";
import type { Category, ScoreValue } from "./category.js";
export type PlayerId = string;
/** A single score-sheet slot; the base sheet has ten of them. */
export interface SheetSlot {
    /** Stable id used by the wire and UI. */
    id: string;
    /** Scoring category represented by the slot. */
    kind: Category;
    /** Display label, for example "Ятци II". */
    label: string;
    /** Recorded score, if the slot is filled. */
    score?: ScoreValue;
    /** Points are fixed and the slot cannot be filled again. */
    locked: boolean;
}
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
