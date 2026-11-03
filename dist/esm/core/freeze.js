/**
 * Dice freeze rules (ADR-014/015).
 *
 * Forced locks (parity, selected face, auto-freeze) always apply. On top of
 * them, a player may keep up to N dice manually when a `freeze-count` rule is
 * active.
 */
import { DICE_COUNT } from "./dice.js";
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
    let auto = null;
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
            case "auto-freeze":
                auto = rule.value === "lowest" || rule.value === "highest" ? rule.value : null;
                break;
        }
    }
    return { count, parity, face, auto };
}
/**
 * Dice that a rule keeps automatically. Auto-freeze only considers the base
 * dice: the extra die is always rerolled.
 */
export function forcedDiceLocks(dice, config) {
    const locks = dice.map((value) => {
        if (config.parity !== null && (value % 2 === 0) === (config.parity === "even")) {
            return true;
        }
        return config.face !== null && value === config.face;
    });
    if (config.auto !== null && dice.length > 0) {
        const limit = Math.min(DICE_COUNT, dice.length);
        let selected = 0;
        for (let index = 1; index < limit; index += 1) {
            const value = dice[index] ?? 1;
            const best = dice[selected] ?? 1;
            if (config.auto === "lowest" ? value < best : value > best) {
                selected = index;
            }
        }
        locks[selected] = true;
    }
    return locks;
}
/** Whether any freeze rule is active in this match. */
export function hasFreezeRules(config) {
    return (config.count !== null ||
        config.parity !== null ||
        config.face !== null ||
        config.auto !== null);
}
/** Frozen dice are both forced by rules and kept manually. */
export function frozenDiceCount(dice, kept, config) {
    const forced = forcedDiceLocks(dice, config);
    const limit = Math.min(DICE_COUNT, dice.length);
    let count = 0;
    for (let index = 0; index < limit; index += 1) {
        if (forced[index] === true || kept[index] === true) {
            count += 1;
        }
    }
    return count;
}
/** How many dice the player has already kept manually. */
export function countKept(kept) {
    return kept.filter(Boolean).length;
}
