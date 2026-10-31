export function ruleOf(rules, aspect) {
    return rules.find((rule) => rule.aspect === aspect);
}
export function hasRule(rules, aspect) {
    return ruleOf(rules, aspect) !== undefined;
}
/**
 * Applies a rule: an existing rule with the same aspect is replaced.
 * Returns a new array and does not mutate the input.
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
 * Number of rerolls allowed per turn. The "no rerolls" card yields 0,
 * "only one reroll" yields 1.
 */
export function rerollLimit(rules) {
    return ruleNumber(ruleOf(rules, "reroll-limit"), DEFAULT_REROLLS);
}
