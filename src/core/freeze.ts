/**
 * Правила заморозки кубиков (ADR-014/015).
 *
 * Принудительные блокировки (чётность, выбранная грань) действуют всегда;
 * сверх них игрок может сам оставить до N кубиков, если есть `freeze-count`.
 */

export interface FreezeConfig {
  /** Сколько кубиков игрок может оставить сам (`null` — нельзя). */
  count: number | "all" | null;
  /** Принудительно удерживаемая чётность. */
  parity: "even" | "odd" | null;
  /** Принудительно удерживаемая грань. */
  face: number | null;
}

interface RuleLike {
  aspect: string;
  value: string;
}

function positiveInt(raw: string | undefined): number | null {
  if (raw === undefined) {
    return null;
  }
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export function freezeConfig(rules: readonly RuleLike[]): FreezeConfig {
  let count: FreezeConfig["count"] = null;
  let parity: FreezeConfig["parity"] = null;
  let face: FreezeConfig["face"] = null;

  for (const rule of rules) {
    switch (rule.aspect) {
      case "freeze-count":
        count = rule.value === "all" ? "all" : positiveInt(rule.value);
        break;
      case "freeze-parity":
        parity = rule.value === "even" || rule.value === "odd" ? rule.value : null;
        break;
      case "freeze-pick":
        face = positiveInt(rule.value);
        if (face !== null && (face < 1 || face > 6)) {
          face = null;
        }
        break;
    }
  }

  return { count, parity, face };
}

/** Кубики, которые правило удерживает принудительно. */
export function forcedDiceLocks(dice: readonly number[], config: FreezeConfig): boolean[] {
  return dice.map((value) => {
    if (config.parity !== null && (value % 2 === 0) === (config.parity === "even")) {
      return true;
    }
    return config.face !== null && value === config.face;
  });
}

/** Есть ли вообще правила заморозки в этой партии. */
export function hasFreezeRules(config: FreezeConfig): boolean {
  return config.count !== null || config.parity !== null || config.face !== null;
}

/** Сколько кубиков игрок уже оставил сам. */
export function countKept(kept: readonly boolean[]): number {
  return kept.filter(Boolean).length;
}
