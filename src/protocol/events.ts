import type { DiceArray } from "../types/dice.js";
import type { CardId } from "../types/card.js";
import type { GameState } from "../types/game.js";

// Сообщения от клиента серверу (только инпуты)
export type ClientToServer =
  | { type: "ROLL" }
  | {
      type: "PLAY_CARD";
      cardId: CardId;
      params?: { face?: number; category?: string; category2?: string };
    }
  | { type: "KEEP_DICE"; indices: number[] }
  | { type: "DISCARD"; cardId: CardId }
  | { type: "COMMIT_SCORE"; category: import("../types/category").Category }
  | { type: "FORCED_DISCARD"; cardId: CardId };

// Сообщения от сервера клиенту
export type ServerToClient =
  | { type: "STATE_UPDATE"; state: GameState }
  | { type: "TIMER_TICK"; phaseEndsAt: number; serverTime: number }
  | { type: "DECK_RESHUFFLED"; message: string }
  | { type: "ERROR"; message: string };
