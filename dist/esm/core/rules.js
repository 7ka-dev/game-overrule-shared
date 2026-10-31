export function ruleOf(rules, aspect) {
    return rules.find((rule) => rule.aspect === aspect);
}
export function hasRule(rules, aspect) {
    return ruleOf(rules, aspect) !== undefined;
}
/**
 * Установка правила: правило того же аспекта заменяется.
 * Возвращает новый массив, исходный не мутируется.
 */
export function upsertRule(rules, next) {
    const filtered = rules.filter((rule) => rule.aspect !== next.aspect);
    return [...filtered, next];
}
export function ruleNumber(rule, fallback) {
    if (!rule) {
        return fallback;
    }
    const value = Number(rule.value);
    return Number.isFinite(value) ? value : fallback;
}
export const DEFAULT_REROLLS = 2;
/**
 * Сколько перебросов разрешено за ход. Карта «запрет перебросов» даёт 0,
 * «только один переброс» — 1.
 */
export function rerollLimit(rules) {
    return ruleNumber(ruleOf(rules, "reroll-limit"), DEFAULT_REROLLS);
}
