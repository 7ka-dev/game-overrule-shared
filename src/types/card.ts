export type CardId = string;

export type EffectScope = "Dice" | "Rolls" | "Rules" | "Score" | "Hand" | "Turn" | "Round";

export interface EffectDefinition {
  id: string;
  scope: EffectScope;
  operation: string; // operation description (expanded when effects are implemented)
  value?: number | string | boolean;
  params?: Record<string, unknown>;
}

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
  | "all-rolls-bonus";

export interface CardRuleSpec {
  aspect: RuleAspect;
  /** Default value when the card does not require a player choice. */
  value?: string;
}

/** One-shot card action that does not create a persistent rule. */
export type CardAction = "swap-category";

export interface Card {
  id: CardId;
  name: string;
  text: string;
  playableIn: import("./phase").Phase[]; // phases in which the card can be played
  effects: EffectDefinition[];
  rule?: CardRuleSpec;
  action?: CardAction;
  /** The card requires a player choice (die value, category, or category pair). */
  choice?: "die" | "category" | "category-pair";
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
