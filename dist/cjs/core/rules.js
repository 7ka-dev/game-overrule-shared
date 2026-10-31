"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_REROLLS = void 0;
exports.ruleOf = ruleOf;
exports.hasRule = hasRule;
exports.upsertRule = upsertRule;
exports.ruleNumber = ruleNumber;
exports.rerollLimit = rerollLimit;
function ruleOf(rules, aspect) {
    return rules.find((rule) => rule.aspect === aspect);
}
function hasRule(rules, aspect) {
    return ruleOf(rules, aspect) !== undefined;
}
/**
 * Установка правила: правило того же аспекта заменяется.
 * Возвращает новый массив, исходный не мутируется.
 */
function upsertRule(rules, next) {
    const filtered = rules.filter((rule) => rule.aspect !== next.aspect);
    return [...filtered, next];
}
function ruleNumber(rule, fallback) {
    if (!rule) {
        return fallback;
    }
    const value = Number(rule.value);
    return Number.isFinite(value) ? value : fallback;
}
exports.DEFAULT_REROLLS = 2;
/**
 * Сколько перебросов разрешено за ход. Карта «запрет перебросов» даёт 0,
 * «только один переброс» — 1.
 */
function rerollLimit(rules) {
    return ruleNumber(ruleOf(rules, "reroll-limit"), exports.DEFAULT_REROLLS);
}
