import type { CardId, RuleAspect } from "../types/card.js";
/**
 * Активное глобальное правило партии (ADR-013/015).
 *
 * Правило действует на всех игроков до конца партии, пока его не перекроет
 * карта того же аспекта. Живёт в синхронизируемом состоянии, потому что её
 * видят и сервер (авторитарные расчёты), и клиент (подсказки и preview очков).
 */
export interface ActiveRule {
    id: string;
    cardId: CardId;
    aspect: RuleAspect;
    value: string;
    ownerId: string;
}
export declare function ruleOf(rules: readonly ActiveRule[], aspect: RuleAspect): ActiveRule | undefined;
export declare function hasRule(rules: readonly ActiveRule[], aspect: RuleAspect): boolean;
/**
 * Установка правила: правило того же аспекта заменяется.
 * Возвращает новый массив, исходный не мутируется.
 */
export declare function upsertRule(rules: readonly ActiveRule[], next: ActiveRule): ActiveRule[];
export declare function ruleNumber(rule: ActiveRule | undefined, fallback: number): number;
export declare const DEFAULT_REROLLS = 2;
/**
 * Сколько перебросов разрешено за ход. Карта «запрет перебросов» даёт 0,
 * «только один переброс» — 1.
 */
export declare function rerollLimit(rules: readonly ActiveRule[]): number;
