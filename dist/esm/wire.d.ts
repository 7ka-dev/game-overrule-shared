import type { CardId, RuleAspect } from "./types/card.js";
import type { Category } from "./types/category.js";
import type { GameEventKind } from "./types/event.js";
import type { Phase } from "./types/phase.js";
/**
 * РџСЂРѕРІРѕРґРЅРѕР№ РєРѕРЅС‚СЂР°РєС‚ СЃРѕСЃС‚РѕСЏРЅРёСЏ Overrule.
 *
 * Р—РґРµСЃСЊ С‚РѕР»СЊРєРѕ СЃС‚СЂСѓРєС‚СѓСЂР° РґР°РЅРЅС‹С…, Р±РµР· Colyseus: РєР»РёРµРЅС‚ РѕСЃС‚Р°С‘С‚СЃСЏ РЅР°
 * `@colyseus/schema` 5, Р° СЃРµСЂРІРµСЂ вЂ” РЅР° 0.17/schema 4, РїРѕСЌС‚РѕРјСѓ РѕР±С‰РёР№ РїР°РєРµС‚
 * РЅРµ РјРѕР¶РµС‚ СЃРѕРґРµСЂР¶Р°С‚СЊ schema-РєР»Р°СЃСЃС‹ РЅРё РѕРґРЅРѕР№ РёР· РІРµСЂСЃРёР№. РЎРµСЂРІРµСЂ РѕРїРёСЃС‹РІР°РµС‚
 * РєР»Р°СЃСЃС‹ СЃС…РµРјС‹ Р»РѕРєР°Р»СЊРЅРѕ Рё РїСЂРѕРІРµСЂСЏРµС‚ СЃРѕРѕС‚РІРµС‚СЃС‚РІРёРµ СЌС‚РѕРјСѓ РєРѕРЅС‚СЂР°РєС‚Сѓ, РєР»РёРµРЅС‚
 * РёСЃРїРѕР»СЊР·СѓРµС‚ РєРѕРЅС‚СЂР°РєС‚ РєР°Рє С‚РёРї СЃРѕСЃС‚РѕСЏРЅРёСЏ РєРѕРјРЅР°С‚С‹.
 */
/** РРјСЏ РєРѕРјРЅР°С‚С‹ Overrule РЅР° СЃРµСЂРІРµСЂРµ (СЃРѕРІРїР°РґР°РµС‚ Сѓ РєР»РёРµРЅС‚Р° Рё СЃРµСЂРІРµСЂР°). */
export declare const OVERRULE_ROOM_NAME = "overrule";
/** РРјСЏ Р»РѕР±Р±Рё-РєРѕРјРЅР°С‚С‹, С‡РµСЂРµР· РєРѕС‚РѕСЂСѓСЋ РєР»РёРµРЅС‚ РїРѕР»СѓС‡Р°РµС‚ СЃРїРёСЃРѕРє РѕС‚РєСЂС‹С‚С‹С… РєРѕРјРЅР°С‚. */
export declare const OVERRULE_LOBBY_ROOM_NAME = "lobby";
/**
 * РњРёРЅРёРјР°Р»СЊРЅР°СЏ С„РѕСЂРјР° РјР°СЃСЃРёРІР° РёР· Colyseus (`ArraySchema` СЂРµР°Р»РёР·СѓРµС‚ `Array`,
 * РЅРѕ РµРіРѕ `concat`/`map` С‚РёРїРёР·РёСЂРѕРІР°РЅС‹ СѓР¶Рµ, С‡РµРј `ReadonlyArray`). РљР»РёРµРЅС‚Сѓ РЅСѓР¶РЅС‹
 * С‚РѕР»СЊРєРѕ С‡С‚РµРЅРёРµ, `at`, `forEach` Рё РёС‚РµСЂР°С†РёСЏ.
 */
export interface WireArray<T> {
    readonly [index: number]: T;
    readonly length: number;
    at(index: number): T | undefined;
    forEach(callbackfn: (value: T, index: number) => void): void;
    [Symbol.iterator](): IterableIterator<T>;
}
export interface CardWire {
    id: CardId;
    name: string;
    text: string;
}
/** Р“Р»РѕР±Р°Р»СЊРЅРѕРµ РєР°СЂС‚РѕС‡РЅРѕРµ РїСЂР°РІРёР»Рѕ РїР°СЂС‚РёРё (ADR-013/014/015). */
export interface RuleWire {
    id: string;
    cardId: CardId;
    aspect: string;
    value: string;
    ownerId: string;
}
/** РџСѓР±Р»РёС‡РЅР°СЏ Р·Р°РїРёСЃСЊ Р¶СѓСЂРЅР°Р»Р° СЃРѕР±С‹С‚РёР№ (ADR-008/009). */
export interface EventWire {
    seq: number;
    kind: GameEventKind;
    actorId: string;
    cardId: CardId | "";
    aspect: RuleAspect | "";
    replaced: boolean;
    category: Category | "";
    points: number;
    dice: WireArray<number>;
    reason: "timeout" | "disconnect" | "";
}
export interface PlayerWire {
    sessionId: string;
    name: string;
    connected: boolean;
    autoPlayed: boolean;
    reconnectPending: boolean;
    score: number;
    rollsLeft: number;
    /** РЎРєРѕР»СЊРєРѕ Р±СЂРѕСЃРєРѕРІ Р±С‹Р»Рѕ РІ РЅР°С‡Р°Р»Рµ С‚РµРєСѓС‰РµРіРѕ С…РѕРґР° (РІРєР»СЋС‡Р°СЏ РЅР°РєРѕРїР»РµРЅРЅС‹Рµ). */
    turnRolls: number;
    /** РќР°РєРѕРїР»РµРЅРЅС‹Рµ РїРµСЂРµР±СЂРѕСЃС‹, РїРµСЂРµРЅРµСЃС‘РЅРЅС‹Рµ РЅР° СЃР»РµРґСѓСЋС‰РёР№ С…РѕРґ. */
    bonusRolls: number;
    /** РћС‡РєРё, СЃРїРёСЃР°РЅРЅС‹Рµ Р·Р° РїР»Р°С‚РЅС‹Рµ РїРµСЂРµР±СЂРѕСЃС‹ РІ СЌС‚РѕРј С…РѕРґСѓ. */
    turnPenalty: number;
    hasRolled: boolean;
    /** РРіСЂРѕРє СѓР¶Рµ СЂР°Р·С‹РіСЂР°Р» РєР°СЂС‚Сѓ РІ СЌС‚РѕРј С…РѕРґСѓ (Р»РёРјРёС‚ вЂ” РѕРґРЅР° РєР°СЂС‚Р°). */
    cardPlayedThisTurn: boolean;
    keepDice: WireArray<boolean>;
    dice: WireArray<number>;
    wildDice: WireArray<boolean>;
    sheet: ReadonlyMap<string, number>;
    hand: WireArray<CardWire>;
    pendingDiscard: boolean;
    discardSecondsLeft: number;
}
export interface GameStateWire {
    gameStatus: "Waiting" | "Playing";
    hostId: string;
    visibility: "public" | "private";
    inviteCode: string;
    phase: Phase;
    round: number;
    activePlayerId: string;
    /** РќР°СЃС‚СЂРѕРµРЅРЅР°СЏ РґР»РёС‚РµР»СЊРЅРѕСЃС‚СЊ РѕР±С‹С‡РЅРѕРіРѕ С…РѕРґР°; grace period РѕС‚РєР»СЋС‡РµРЅРёСЏ РѕС‚РґРµР»СЊРЅС‹Р№. */
    turnDurationSeconds: number;
    /** РћС‚РєР»СЋС‡Р°РµС‚ С‚Р°Р№РјР°СѓС‚ РѕР±С‹С‡РЅРѕРіРѕ С…РѕРґР°, РЅРѕ РЅРµ grace period РґРёСЃРєРѕРЅРЅРµРєС‚Р°. */
    turnTimerEnabled: boolean;
    /** РЎРєРѕР»СЊРєРѕ СЃРµРєСѓРЅРґ РѕСЃС‚Р°Р»РѕСЃСЊ РЅР° С…РѕРґ. РўРёРєР°РµС‚ С‚РѕР»СЊРєРѕ СЃРµСЂРІРµСЂ. */
    turnSecondsLeft: number;
    rules: WireArray<RuleWire>;
    events: WireArray<EventWire>;
    players: WireArray<PlayerWire>;
}
