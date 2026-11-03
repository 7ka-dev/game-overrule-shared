import { SCORE_CATEGORIES } from "./categories.js";
/** Fresh base sheet: the ten MVP categories, each with a stable id. */
export function createBaseSheet() {
    return SCORE_CATEGORIES.map((category) => ({
        id: category,
        kind: category,
        label: category,
        locked: false,
    }));
}
/** Find a slot by its stable id, then by category (for base sheets). */
export function sheetSlot(slots, category) {
    return (slots.find((slot) => slot.id === category) ??
        slots.find((slot) => slot.kind === category));
}
/** Compatibility record for scoring and existing server/client code. */
export function sheetSlotsToRecord(slots) {
    const sheet = {};
    for (const slot of slots) {
        // Extra slots have their own ids; the base category remains canonical.
        if (slot.id === slot.kind && slot.score !== undefined && slot.score !== null) {
            sheet[slot.kind] = slot.score;
        }
    }
    return sheet;
}
export function takenCategoriesFromSlots(slots) {
    const taken = [];
    for (const slot of slots) {
        if (slot.id === slot.kind && slot.score !== undefined && slot.score !== null) {
            taken.push(slot.kind);
        }
    }
    return taken;
}
export function isSheetCompleteSlots(slots) {
    return SCORE_CATEGORIES.every((category) => {
        const slot = sheetSlot(slots, category);
        return slot?.score !== undefined && slot.score !== null;
    });
}
