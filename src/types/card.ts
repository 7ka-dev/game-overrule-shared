export type CardId = string;

export type EffectScope = "Dice" | "Rolls" | "Rules" | "Score" | "Hand" | "Turn" | "Round";

export interface EffectDefinition {
  id: string;
  scope: EffectScope;
  operation: string; // operation description (expanded when effects are implemented)
  value?: number | string | boolean;
  params?: Record<string, unknown>;
}

/** How `score-inversion` transforms die faces during scoring. */
export type ScoreInversionMode = "invert" | "shift-up" | "shift-down";

/**
 * Game rule aspect (ADR-013/015). Rules are global: they affect all players
 * until the end of the match, until a card with the same aspect replaces them.
 * A new rule of the same aspect replaces the previous one; different aspects
 * coexist.
 */
export type RuleAspect =
  | "freeze-count"
  | "freeze-parity"
  | "freeze-pick"
  | "reroll-limit"
  | "reroll-cost"
  | "reroll-accumulate"
  | "joker-face"
  | "banned-face"
  | "extra-die"
  | "die-multiplier"
  | "score-inversion"
  | "seven-triple"
  | "first-roll-double"
  | "target-category-double"
  | "all-rolls-bonus"
  | "card-timing"
  | "category-cap"
  | "repeat-category-double"
  | "card-cost"
  | "frozen-penalty"
  | "taken-category-bonus"
  | "taken-category-penalty"
  | "forced-reroll"
  | "auto-freeze"
  | "standings-card-limit"
  | "card-lock-round"
  | "card-discard"
  | "turn-start-dice"
  | "hidden-dice"
  | "reroll-face-limit"
  | "round-suit"
  | "sheet-overwrite"
  | "sheet-extra-category";

export interface CardRuleSpec {
  aspect: RuleAspect;
  /** Default value when the card does not require a player choice. */
  value?: string;
}

/** One-shot card action that does not create a persistent rule. */
export type CardAction =
  | "swap-category"
  | "cancel-rule"
  | "cancel-rules"
  | "cancel-all-rules"
  | "trade-cards"
  | "sheet-extra-category"
  | "discard-to-deck";

/** Parameters a card asks the player to choose before it can be resolved. */
export type CardChoice =
  | "die"
  | "category"
  | "category-pair"
  | "rule"
  | "rule-pair"
  | "player"
  | "cards";

export interface Card {
  id: CardId;
  name: string;
  text: string;
  playableIn: import("./phase").Phase[]; // phases in which the card can be played
  effects: EffectDefinition[];
  rule?: CardRuleSpec;
  action?: CardAction;
  /** Value for actions such as `cancel-rules = 2` or `sheet-extra-category = Yahtzee`. */
  actionValue?: string;
  /** The card must be played before the first roll of the turn. */
  requiresBeforeRoll?: boolean;
  /** Per-turn play limit override for special cards. */
  maxPerTurn?: number;
  /** Whether the action targets only the owner or any player. */
  target?: "self" | "any";
  /** The card requires a player choice before it can be resolved. */
  choice?: CardChoice;
}

export interface ActiveEffect {
  id: string;
  cardId: CardId;
  sourcePlayerId: string;
  targetPlayerId: string | null;
  trigger?: string;
  timer?: number; // timer in ticks/ms, to be agreed on
  params?: Record<string, unknown>;
  resolvedAt?: number;
}
