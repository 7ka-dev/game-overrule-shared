import { shuffle } from "../utils/shuffle.js";
/**
 * Card catalog: the agreed card set (ADR-014, ADR-015).
 *
 * Cards have no types or targets: a played card sets a global rule that
 * affects all players until the end of the match, until a card with the same
 * aspect replaces it. One-shot actions (such as "Swap") are the exception.
 */
function card(id, name, text, playableIn, rule, extra) {
    return { id, name, text, playableIn, effects: [], rule, ...extra };
}
/** A card played during the player's own turn. */
const gameCard = (id, name, text, rule, extra) => {
    const { playableIn = ["Roll", "Decision", "Commit"], ...rest } = extra ?? {};
    return card(id, name, text, playableIn, rule, rest);
};
const rule = (aspect, value) => ({
    aspect,
    value,
});
export const CARD_CATALOG = [
    // ── Combination scoring ───────────────────────────────────────────────────
    gameCard("target-category", "Ставка на комбинацию", "Выбери категорию: закроешь её — очки ×2", rule("target-category-double"), { choice: "category", playableIn: ["Roll"] }),
    gameCard("first-roll-double", "Чистый бросок", "Если зафиксировать комбинацию с первого броска, очки ×2", rule("first-roll-double")),
    gameCard("seven-triple", "Счастливая семёрка", "Если сумма комбинации ровно 7, начисляется 21", rule("seven-triple")),
    gameCard("all-rolls-bonus", "Полная выкладка", "Если израсходованы все броски хода, очки комбинации +50%", rule("all-rolls-bonus")),
    gameCard("die-multiplier", "Кубик-множитель", "Выбери значение: если кубик с ним идёт в зачёт, он умножает итог вместо сложения", rule("die-multiplier"), { choice: "die" }),
    // ── Rerolls ───────────────────────────────────────────────────────────────
    gameCard("no-reroll", "Стоп-кран", "Игроки больше не могут перебрасывать кубики", rule("reroll-limit", "0")),
    gameCard("one-reroll", "Один шанс", "Игроки могут перебросить кубики только один раз", rule("reroll-limit", "1")),
    gameCard("reroll-cost", "Дорогой переброс", "Первый переброс стоит 1 очко, второй — 2", rule("reroll-cost", "1")),
    gameCard("reroll-bank", "Запас хода", "Неиспользованные перебросы накапливаются до следующего хода", rule("reroll-accumulate")),
    // ── Dice freeze ───────────────────────────────────────────────────────────
    gameCard("freeze-1", "Лёгкая заморозка", "Можешь замораживать 1 кубик", rule("freeze-count", "1")),
    gameCard("freeze-2", "Заморозка пары", "Можешь замораживать 2 кубика", rule("freeze-count", "2")),
    gameCard("freeze-3", "Заморозка тройки", "Можешь замораживать 3 кубика", rule("freeze-count", "3")),
    gameCard("freeze-4", "Заморозка четвёрки", "Можешь замораживать 4 кубика", rule("freeze-count", "4")),
    gameCard("freeze-all", "Полная заморозка", "Можешь замораживать кубики без ограничений", rule("freeze-count", "all")),
    gameCard("freeze-even", "Чётный замок", "Нельзя перебрасывать чётные кубики", rule("freeze-parity", "even")),
    gameCard("freeze-odd", "Нечётный замок", "Нельзя перебрасывать нечётные кубики", rule("freeze-parity", "odd")),
    gameCard("locked-die", "Приколотый кубик", "Выбери значение: кубики с ним нельзя перебрасывать", rule("freeze-pick"), { choice: "die" }),
    // ── Jokers ────────────────────────────────────────────────────────────────
    gameCard("joker-1", "Единицы — джокеры", "Все «1» считаются джокерами", rule("joker-face", "1")),
    gameCard("joker-2", "Двойки — джокеры", "Все «2» считаются джокерами", rule("joker-face", "2")),
    gameCard("joker-3", "Тройки — джокеры", "Все «3» считаются джокерами", rule("joker-face", "3")),
    gameCard("joker-4", "Четвёрки — джокеры", "Все «4» считаются джокерами", rule("joker-face", "4")),
    gameCard("joker-5", "Пятёрки — джокеры", "Все «5» считаются джокерами", rule("joker-face", "5")),
    gameCard("joker-6", "Шестёрки — джокеры", "Все «6» считаются джокерами", rule("joker-face", "6")),
    // ── Banned faces ──────────────────────────────────────────────────────────
    gameCard("no-ones", "Без единиц", "На кубиках не выпадает «1»", rule("banned-face", "1")),
    gameCard("no-twos", "Без двоек", "На кубиках не выпадает «2»", rule("banned-face", "2")),
    gameCard("no-threes", "Без троек", "На кубиках не выпадает «3»", rule("banned-face", "3")),
    gameCard("no-fours", "Без четвёрок", "На кубиках не выпадает «4»", rule("banned-face", "4")),
    gameCard("no-fives", "Без пятёрок", "На кубиках не выпадает «5»", rule("banned-face", "5")),
    gameCard("no-sixes", "Без шестёрок", "На кубиках не выпадает «6»", rule("banned-face", "6")),
    // ── Dice ──────────────────────────────────────────────────────────────────
    gameCard("extra-die", "Лишний кубик", "Кидай 6 кубиков: грань лишнего учитывается в комбинации", rule("extra-die")),
    gameCard("inversion", "Искажение", "При подсчёте очков грани инвертируются: 1↔6, 2↔5, 3↔4", rule("score-inversion")),
    // ── Category swap ─────────────────────────────────────────────────────────
    gameCard("swap-category", "Замена", "Поменяй местами две комбинации: статус и очки переходят", undefined, { action: "swap-category", choice: "category-pair" }),
];
export const CARD_BY_ID = new Map(CARD_CATALOG.map((entry) => [entry.id, entry]));
/** Number of cards in the starting hand (GDD §4). */
export const START_HAND = 3;
/** Maximum hand size (GDD §4). */
export const MAX_HAND = 4;
/** Seconds allowed for a forced discard (GDD §4). */
export const FORCED_DISCARD_SECONDS = 3;
export function createDeck(random = Math.random) {
    return shuffle(CARD_CATALOG.map((entry) => entry.id), random);
}
/**
 * Draws cards. When the deck is empty, the discard pile is shuffled and
 * becomes the new deck (GDD §4: "1-2 reshuffles per session with 8 players").
 */
export function drawCards(deck, discard, count, random = Math.random) {
    let pool = [...deck];
    let graveyard = [...discard];
    const drawn = [];
    for (let index = 0; index < count; index += 1) {
        if (pool.length === 0) {
            if (graveyard.length === 0) {
                break;
            }
            pool = shuffle(graveyard, random);
            graveyard = [];
        }
        const next = pool.shift();
        if (next === undefined) {
            break;
        }
        drawn.push(next);
    }
    return { drawn, deck: pool, discard: graveyard };
}
