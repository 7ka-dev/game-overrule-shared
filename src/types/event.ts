import type { CardId, RuleAspect } from "./card.js";
import type { Category } from "./category.js";
import type { PlayerId } from "./player.js";

/** Public game event kind. */
export type GameEventKind =
  | "game-start"
  | "turn"
  | "roll"
  | "card-played"
  | "commit"
  | "disconnect"
  | "reconnect"
  | "autoplay"
  | "game-over";

/**
 * Game log entry (ADR-008: the log is part of the authoritative state).
 *
 * Only public data is included: other players' hands and the deck order never
 * appear here (ADR-009).
 */
export interface GameLogEvent {
  seq: number;
  kind: GameEventKind;
  /** Player the event belongs to. */
  actorId: PlayerId;
  /** Played card (for `card-played`). */
  cardId?: CardId;
  /** Aspect of the applied rule (for `card-played`). */
  aspect?: RuleAspect;
  /** The card replaced an existing rule of the same aspect. */
  replaced?: boolean;
  /** Filled category (for `commit`). */
  category?: Category;
  /** Awarded points (for `commit`). */
  points?: number;
  /** Dice values from a roll or the final combination (`roll`, `commit`). */
  dice?: number[];
  /** Autoplay reason (for `autoplay`). */
  reason?: "timeout" | "disconnect";
}
