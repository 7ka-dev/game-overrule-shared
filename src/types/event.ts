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
  | "game-over"
  | "rule-cancelled"
  | "card-discarded"
  | "cards-traded"
  | "category-overwritten";

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
  /** Cancelled rule id (for `rule-cancelled`). */
  ruleId?: string;
  /** Other player involved in a trade. */
  targetId?: PlayerId;
  /** Cards moved by a trade or discard; never hidden hands in public state. */
  cardIds?: CardId[];
  /** Filled category (for `commit`). */
  category?: Category;
  /** Previous category for overwrite/repeat rules. */
  previousCategory?: Category;
  /** New category for overwrite/extra-slot rules. */
  nextCategory?: Category;
  /** Awarded points (for `commit`). */
  points?: number;
  /** Dice values from a roll or the final combination (`roll`, `commit`). */
  dice?: number[];
  /** Autoplay reason (for `autoplay`). */
  reason?: "timeout" | "disconnect";
}
