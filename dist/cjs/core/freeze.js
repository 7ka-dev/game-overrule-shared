"use strict";
/**
 * Dice freeze rules (ADR-014/015).
 *
 * Forced locks (parity, selected face, auto-freeze) always apply. On top of
 * them, a player may keep up to N dice manually when a `freeze-count` rule is
 * active.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.freezeConfig = freezeConfig;
exports.forcedDiceLocks = forcedDiceLocks;
exports.hasFreezeRules = hasFreezeRules;
exports.frozenDiceCount = frozenDiceCount;
exports.countKept = countKept;
const dice_js_1 = require("./dice.js");
function positiveInt(raw) {
    if (raw === undefined) {
        return null;
    }
    const value = Number(raw);
    return Number.isInteger(value) && value > 0 ? value : null;
}
function freezeConfig(rules) {
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
function forcedDiceLocks(dice, config) {
    const locks = dice.map((value) => {
        if (config.parity !== null && (value % 2 === 0) === (config.parity === "even")) {
            return true;
        }
        return config.face !== null && value === config.face;
    });
    if (config.auto !== null && dice.length > 0) {
        const limit = Math.min(dice_js_1.DICE_COUNT, dice.length);
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
function hasFreezeRules(config) {
    return (config.count !== null ||
        config.parity !== null ||
        config.face !== null ||
        config.auto !== null);
}
/** Frozen dice are both forced by rules and kept manually. */
function frozenDiceCount(dice, kept, config) {
    const forced = forcedDiceLocks(dice, config);
    const limit = Math.min(dice_js_1.DICE_COUNT, dice.length);
    let count = 0;
    for (let index = 0; index < limit; index += 1) {
        if (forced[index] === true || kept[index] === true) {
            count += 1;
        }
    }
    return count;
}
/** How many dice the player has already kept manually. */
function countKept(kept) {
    return kept.filter(Boolean).length;
}
