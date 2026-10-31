import type { RandomFn } from "./dice.js";
import type { Card, CardId } from "../types/card.js";
export declare const CARD_CATALOG: readonly Card[];
export declare const CARD_BY_ID: ReadonlyMap<CardId, Card>;
/** Number of cards in the starting hand (GDD §4). */
export declare const START_HAND = 3;
/** Maximum hand size (GDD §4). */
export declare const MAX_HAND = 4;
/** Seconds allowed for a forced discard (GDD §4). */
export declare const FORCED_DISCARD_SECONDS = 3;
export declare function createDeck(random?: RandomFn): CardId[];
export interface DrawResult {
    drawn: CardId[];
    deck: CardId[];
    discard: CardId[];
}
/**
 * Draws cards. When the deck is empty, the discard pile is shuffled and
 * becomes the new deck (GDD §4: "1-2 reshuffles per session with 8 players").
 */
export declare function drawCards(deck: readonly CardId[], discard: readonly CardId[], count: number, random?: RandomFn): DrawResult;
