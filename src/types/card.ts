export type CardId = string;

export type EffectScope = "Dice" | "Rolls" | "Rules" | "Score" | "Hand" | "Turn" | "Round";

export interface EffectDefinition {
  id: string;
  scope: EffectScope;
  operation: string; // описание операции (будет детализировано при реализации эффектов)
  value?: number | string | boolean;
  params?: Record<string, unknown>;
}

/**
 * Аспект игрового правила (ADR-013/015). Правило глобально: действует на всех
 * игроков до конца партии, пока его не перекроет карта того же аспекта.
 * Новое правило того же аспекта заменяет предыдущее; разные аспекты сосуществуют.
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
  /** Значение по умолчанию, если карта не требует выбора игрока. */
  value?: string;
}

/** Разовое действие карты, не создающее постоянного правила. */
export type CardAction = "swap-category";

export interface Card {
  id: CardId;
  name: string;
  text: string;
  playableIn: import("./phase").Phase[]; // фазы, в которых можно сыграть
  effects: EffectDefinition[];
  rule?: CardRuleSpec;
  action?: CardAction;
  /** Карте нужен выбор игрока (значение кубика или категория). */
  choice?: "die" | "category" | "category-pair";
}

export interface ActiveEffect {
  id: string;
  cardId: CardId;
  sourcePlayerId: string;
  targetPlayerId: string | null;
  trigger?: string;
  timer?: number; // таймер в тиках/мс по согласованию
  params?: Record<string, unknown>;
  resolvedAt?: number;
}
