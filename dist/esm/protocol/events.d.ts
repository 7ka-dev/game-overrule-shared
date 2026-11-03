import type { CardId } from "../types/card.js";
import type { GameState } from "../types/game.js";
export type ClientToServer = {
    type: "ROLL";
} | {
    type: "PLAY_CARD";
    cardId: CardId;
    params?: {
        face?: number;
        category?: string;
        category2?: string;
        ruleId?: string;
        ruleIds?: string[];
        targetId?: string;
        cardIds?: CardId[];
    };
} | {
    type: "KEEP_DICE";
    indices: number[];
} | {
    type: "SET_REROLL_FACE";
    face: number;
} | {
    type: "DISCARD";
    cardId: CardId;
} | {
    type: "DISCARD_TO_DECK";
    cardId: CardId;
} | {
    type: "COMMIT_SCORE";
    category: import("../types/category").Category;
} | {
    type: "FORCED_DISCARD";
    cardId: CardId;
};
export type ServerToClient = {
    type: "STATE_UPDATE";
    state: GameState;
} | {
    type: "TIMER_TICK";
    phaseEndsAt: number;
    serverTime: number;
} | {
    type: "DECK_RESHUFFLED";
    message: string;
} | {
    type: "ERROR";
    message: string;
};
