/**
 * Dice freeze rules (ADR-014/015).
 *
 * Forced locks (parity, selected face) always apply. On top of them, a player
 * may keep up to N dice manually when a `freeze-count` rule is active.
 */
function positiveInt(raw) {
    if (raw === undefined) {
        return null;
    }
    const value = Number(raw);
    return Number.isInteger(value) && value > 0 ? value : null;
}
export function freezeConfig(rules) {
    let count = null;
    let parity = null;
    let face = null;
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
/** Dice that a rule keeps automatically. */
export function forcedDiceLocks(dice, config) {
    return dice.map((value) => {
        if (config.parity !== null && (value % 2 === 0) === (config.parity === "even")) {
            return true;
        }
        return config.face !== null && value === config.face;
    });
}
/** Whether any freeze rule is active in this match. */
export function hasFreezeRules(config) {
    return config.count !== null || config.parity !== null || config.face !== null;
}
/** How many dice the player has already kept manually. */
export function countKept(kept) {
    return kept.filter(Boolean).length;
}
