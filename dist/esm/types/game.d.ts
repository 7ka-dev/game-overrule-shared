import type { PlayerId, PlayerState } from "./player.js";
import type { Category } from "./category.js";
import type { CardId, ActiveEffect } from "./card.js";
import type { Phase } from "./phase.js";
export type RoomId = string;
export type RulesModifier = {
    id: string;
    name: string;
    active: boolean;
    params?: Record<string, unknown>;
};
export type GameEventType = "ROLL" | "CARD_PLAYED" | "SCORE_COMMITTED" | "PHASE_CHANGE" | "DECK_RESHUFFLED";
export interface GameEvent {
    id: string;
    type: GameEventType;
    at: number;
    playerId?: PlayerId;
    payload?: Record<string, unknown>;
}
export interface GameState {
    roomId: RoomId;
    players: PlayerState[];
    activePlayerId: PlayerId | null;
    phase: Phase;
    phaseEndsAt: number;
    turnNumber: number;
    categoryForRound?: Category;
    deck: CardId[];
    discard: CardId[];
    activeEffects: ActiveEffect[];
    history: GameEvent[];
    rulesModifiers: RulesModifier[];
}
