import type { Category } from "../types/category.js";
import type { SheetSlot } from "../types/player.js";
/** Fresh base sheet: the ten MVP categories, each with a stable id. */
export declare function createBaseSheet(): SheetSlot[];
/** Find a slot by its stable id, then by category (for base sheets). */
export declare function sheetSlot(slots: readonly SheetSlot[], category: Category): SheetSlot | undefined;
/** Compatibility record for scoring and existing server/client code. */
export declare function sheetSlotsToRecord(slots: readonly SheetSlot[]): Partial<Record<Category, number>>;
export declare function takenCategoriesFromSlots(slots: readonly SheetSlot[]): Category[];
export declare function isSheetCompleteSlots(slots: readonly SheetSlot[]): boolean;
