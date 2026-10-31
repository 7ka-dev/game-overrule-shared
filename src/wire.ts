import type { CardId, RuleAspect } from "./types/card.js";
import type { Category } from "./types/category.js";
import type { GameEventKind } from "./types/event.js";
import type { Phase } from "./types/phase.js";

/**
 * Проводной контракт состояния Overrule.
 *
 * Здесь только структура данных, без Colyseus: клиент остаётся на
 * `@colyseus/schema` 5, а сервер — на 0.17/schema 4, поэтому общий пакет
 * не может содержать schema-классы ни одной из версий. Сервер описывает
 * классы схемы локально и проверяет соответствие этому контракту, клиент
 * использует контракт как тип состояния комнаты.
 */

/** Имя комнаты Overrule на сервере (совпадает у клиента и сервера). */
export const OVERRULE_ROOM_NAME = "overrule";

/** Имя лобби-комнаты, через которую клиент получает список открытых комнат. */
export const OVERRULE_LOBBY_ROOM_NAME = "lobby";

export interface CardWire {
  id: CardId;
  name: string;
  text: string;
}

/** Глобальное карточное правило партии (ADR-013/014/015). */
export interface RuleWire {
  id: string;
  cardId: CardId;
  aspect: string;
  value: string;
  ownerId: string;
}

/** Публичная запись журнала событий (ADR-008/009). */
export interface EventWire {
  seq: number;
  kind: GameEventKind;
  actorId: string;
  cardId: CardId | "";
  aspect: RuleAspect | "";
  replaced: boolean;
  category: Category | "";
  points: number;
  dice: ReadonlyArray<number>;
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
  /** Сколько бросков было в начале текущего хода (включая накопленные). */
  turnRolls: number;
  /** Накопленные перебросы, перенесённые на следующий ход. */
  bonusRolls: number;
  /** Очки, списанные за платные перебросы в этом ходу. */
  turnPenalty: number;
  hasRolled: boolean;
  /** Игрок уже разыграл карту в этом ходу (лимит — одна карта). */
  cardPlayedThisTurn: boolean;
  keepDice: ReadonlyArray<boolean>;
  dice: ReadonlyArray<number>;
  wildDice: ReadonlyArray<boolean>;
  sheet: ReadonlyMap<string, number>;
  hand: ReadonlyArray<CardWire>;
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
  /** Настроенная длительность обычного хода; grace period отключения отдельный. */
  turnDurationSeconds: number;
  /** Отключает таймаут обычного хода, но не grace period дисконнекта. */
  turnTimerEnabled: boolean;
  /** Сколько секунд осталось на ход. Тикает только сервер. */
  turnSecondsLeft: number;
  rules: ReadonlyArray<RuleWire>;
  events: ReadonlyArray<EventWire>;
  players: ReadonlyArray<PlayerWire>;
}
