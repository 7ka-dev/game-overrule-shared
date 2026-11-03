import type { CardId, RuleAspect } from "./types/card.js";
import type { Category } from "./types/category.js";
import type { GameEventKind } from "./types/event.js";
import type { Phase } from "./types/phase.js";
/**
 * Wire contract for the Overrule room state.
 *
 * This file contains data shapes only, with no Colyseus dependency. The
 * client and server both use Colyseus 0.17 today, but keeping the contract as
 * plain TypeScript avoids coupling this package to a specific schema version.
 * The server defines its schema classes locally and checks them against this
 * contract at build time; the client uses the contract as the room state type.
 */
/** Overrule room name on the server (must match on client and server). */
export declare const OVERRULE_ROOM_NAME = "overrule";
/** Lobby room name used by the client to list public rooms. */
export declare const OVERRULE_LOBBY_ROOM_NAME = "lobby";
/**
 * Minimal array shape for Colyseus arrays. `ArraySchema` implements `Array`,
 * but its `concat`/`map` signatures are narrower than `ReadonlyArray`.
 * The client only needs indexed access, `at`, `forEach`, and iteration.
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
/** Global card rule for a match (ADR-013/014/015). */
export interface RuleWire {
    id: string;
    cardId: CardId;
    aspect: string;
    value: string;
    ownerId: string;
}
/** Public game log entry (ADR-008/009). */
export interface EventWire {
    seq: number;
    kind: GameEventKind;
    actorId: string;
    cardId: CardId | "";
    aspect: RuleAspect | "";
    replaced: boolean;
    ruleId?: string;
    targetId?: string;
    cardIds?: WireArray<CardId>;
    category: Category | "";
    previousCategory?: Category | "";
    nextCategory?: Category | "";
    points: number;
    dice: WireArray<number>;
    reason: "timeout" | "disconnect" | "";
}
/** Score-sheet slot; `filled` distinguishes an empty slot from a zero score. */
export interface SheetSlotWire {
    id: string;
    kind: Category;
    label: string;
    score: number;
    filled: boolean;
    locked: boolean;
}
export interface PlayerWire {
    sessionId: string;
    name: string;
    connected: boolean;
    autoPlayed: boolean;
    reconnectPending: boolean;
    score: number;
    rollsLeft: number;
    /** Number of rolls at the start of the current turn, including banked rolls. */
    turnRolls: number;
    /** Banked rerolls carried over to the next turn. */
    bonusRolls: number;
    /** Points deducted for paid rerolls during this turn. */
    turnPenalty: number;
    hasRolled: boolean;
    /** The player has already played a card this turn (limit: one card). */
    cardPlayedThisTurn: boolean;
    /** Number of cards played this turn; optional until multi-card rules land. */
    cardsPlayedThisTurn?: number;
    /** Extra card plays granted by a successful trade. */
    bonusCardPlaysThisTurn?: number;
    /** Face selected for reroll-face-limit; 0 means not selected. */
    rerollFace?: number;
    keepDice: WireArray<boolean>;
    dice: WireArray<number>;
    wildDice: WireArray<boolean>;
    sheet: ReadonlyMap<string, number>;
    /** Future dynamic sheet; optional until task 035 wires it end-to-end. */
    sheetSlots?: WireArray<SheetSlotWire>;
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
    /** Configured normal turn duration; the disconnect grace period is separate. */
    turnDurationSeconds: number;
    /** Disables the normal turn timeout, but not the disconnect grace period. */
    turnTimerEnabled: boolean;
    /** Seconds left in the turn. Ticked by the server only. */
    turnSecondsLeft: number;
    /** Last committed category; optional until repeat/overwrite rules land. */
    previousCategory?: Category | "";
    /** First category closed in the current round; optional until round-suit lands. */
    roundSuitCategory?: Category | "";
    /** Player who closed the first category of the round. */
    roundSuitOwnerId?: string;
    /** Round number in which the suit was set. */
    roundSuitRound?: number;
    rules: WireArray<RuleWire>;
    events: WireArray<EventWire>;
    players: WireArray<PlayerWire>;
}
