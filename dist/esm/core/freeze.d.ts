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
export declare function freezeConfig(rules: readonly RuleLike[]): FreezeConfig;
/** Кубики, которые правило удерживает принудительно. */
export declare function forcedDiceLocks(dice: readonly number[], config: FreezeConfig): boolean[];
/** Есть ли вообще правила заморозки в этой партии. */
export declare function hasFreezeRules(config: FreezeConfig): boolean;
/** Сколько кубиков игрок уже оставил сам. */
export declare function countKept(kept: readonly boolean[]): number;
export {};
