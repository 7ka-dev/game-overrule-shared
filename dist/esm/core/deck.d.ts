import type { RandomFn } from "./dice.js";
import type { Card, CardId } from "../types/card.js";
export declare const CARD_CATALOG: readonly Card[];
export declare const CARD_BY_ID: ReadonlyMap<CardId, Card>;
/** Сколько карт на руке в начале игры (GDD §4). */
export declare const START_HAND = 3;
/** Максимум карт на руке (GDD §4). */
export declare const MAX_HAND = 4;
/** Сколько секунд даётся на принудительный сброс (GDD §4). */
export declare const FORCED_DISCARD_SECONDS = 3;
export declare function createDeck(random?: RandomFn): CardId[];
export interface DrawResult {
    drawn: CardId[];
    deck: CardId[];
    discard: CardId[];
}
/**
 * Добор карт. Когда колода пуста, сброс перемешивается и становится колодой
 * (GDD §4: «Перемешивание 1–2 раза за сессию на 8 игроков»).
 */
export declare function drawCards(deck: readonly CardId[], discard: readonly CardId[], count: number, random?: RandomFn): DrawResult;
