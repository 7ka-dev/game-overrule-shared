import type { CardId, RuleAspect } from "./card.js";
import type { Category } from "./category.js";
import type { PlayerId } from "./player.js";
/** Публичный тип события партии. */
export type GameEventKind = "game-start" | "turn" | "roll" | "card-played" | "commit" | "disconnect" | "reconnect" | "autoplay" | "game-over";
/**
 * Запись журнала событий (ADR-008: журнал — часть авторитарного состояния).
 *
 * В событие попадают только публичные данные: содержимое чужих рук и порядок
 * колоды здесь не появляются (ADR-009).
 */
export interface GameLogEvent {
    seq: number;
    kind: GameEventKind;
    /** Игрок, к которому относится событие. */
    actorId: PlayerId;
    /** Разыгранная карта (для `card-played`). */
    cardId?: CardId;
    /** Аспект установленного правила (для `card-played`). */
    aspect?: RuleAspect;
    /** Карта заменила правило того же аспекта. */
    replaced?: boolean;
    /** Закрытая категория (для `commit`). */
    category?: Category;
    /** Начисленные очки (для `commit`). */
    points?: number;
    /** Значения кубиков броска или финальной комбинации (`roll`, `commit`). */
    dice?: number[];
    /** Причина автохода (для `autoplay`). */
    reason?: "timeout" | "disconnect";
}
