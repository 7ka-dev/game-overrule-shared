import type { RandomFn } from "./dice.js";
import type { Card, CardId, CardRuleSpec } from "../types/card.js";
import type { Phase } from "../types/phase.js";
import { shuffle } from "../utils/shuffle.js";

/**
 * Card catalog: the agreed card set (ADR-014, ADR-015).
 *
 * Cards have no types or targets: a played card sets a global rule that
 * affects all players until the end of the match, until a card with the same
 * aspect replaces it. One-shot actions (such as "Swap") are the exception.
 */

function card(
  id: string,
  name: string,
  text: string,
  playableIn: Phase[],
  rule?: CardRuleSpec,
  extra?: Pick<Card, "action" | "choice" | "actionValue">,
): Card {
  return { id, name, text, playableIn, effects: [], rule, ...extra };
}

/** A card played during the player's own turn. */
const gameCard = (
  id: string,
  name: string,
  text: string,
  rule: CardRuleSpec | undefined,
  extra?: Pick<Card, "action" | "choice" | "actionValue"> & { playableIn?: Phase[] },
): Card => {
  const { playableIn = ["Roll", "Decision", "Commit"], ...rest } = extra ?? {};
  return card(id, name, text, playableIn, rule, rest);
};

const rule = (aspect: CardRuleSpec["aspect"], value?: string): CardRuleSpec => ({
  aspect,
  value,
});

export const CARD_CATALOG: readonly Card[] = [
  // ── Combination scoring ───────────────────────────────────────────────────
  gameCard(
    "target-category",
    "Ставка на комбинацию",
    "Выбери категорию: закроешь её — очки ×2",
    rule("target-category-double"),
    { choice: "category", playableIn: ["Roll"] },
  ),
  gameCard(
    "first-roll-double",
    "Чистый бросок",
    "Если зафиксировать комбинацию с первого броска, очки ×2",
    rule("first-roll-double"),
  ),
  gameCard(
    "seven-triple",
    "Счастливая семёрка",
    "Если сумма комбинации ровно 7, начисляется 21",
    rule("seven-triple"),
  ),
  gameCard(
    "all-rolls-bonus",
    "Полная выкладка",
    "Если израсходованы все броски хода, очки комбинации +50%",
    rule("all-rolls-bonus"),
  ),
  gameCard(
    "die-multiplier",
    "Кубик-множитель",
    "Выбери значение: если кубик с ним идёт в зачёт, он умножает итог вместо сложения",
    rule("die-multiplier"),
    { choice: "die" },
  ),

  // ── Rerolls ───────────────────────────────────────────────────────────────
  gameCard(
    "no-reroll",
    "Стоп-кран",
    "Игроки больше не могут перебрасывать кубики",
    rule("reroll-limit", "0"),
  ),
  gameCard(
    "one-reroll",
    "Один шанс",
    "Игроки могут перебросить кубики только один раз",
    rule("reroll-limit", "1"),
  ),
  gameCard(
    "reroll-cost",
    "Дорогой переброс",
    "Первый переброс стоит 1 очко, второй — 2",
    rule("reroll-cost", "1"),
  ),
  gameCard(
    "reroll-bank",
    "Запас хода",
    "Неиспользованные перебросы накапливаются до следующего хода",
    rule("reroll-accumulate"),
  ),

  // ── Dice freeze ───────────────────────────────────────────────────────────
  gameCard("freeze-1", "Лёгкая заморозка", "Можешь замораживать 1 кубик", rule("freeze-count", "1")),
  gameCard("freeze-2", "Заморозка пары", "Можешь замораживать 2 кубика", rule("freeze-count", "2")),
  gameCard("freeze-3", "Заморозка тройки", "Можешь замораживать 3 кубика", rule("freeze-count", "3")),
  gameCard("freeze-4", "Заморозка четвёрки", "Можешь замораживать 4 кубика", rule("freeze-count", "4")),
  gameCard("freeze-all", "Полная заморозка", "Можешь замораживать кубики без ограничений", rule("freeze-count", "all")),
  gameCard(
    "freeze-even",
    "Чётный замок",
    "Нельзя перебрасывать чётные кубики",
    rule("freeze-parity", "even"),
  ),
  gameCard(
    "freeze-odd",
    "Нечётный замок",
    "Нельзя перебрасывать нечётные кубики",
    rule("freeze-parity", "odd"),
  ),
  gameCard(
    "locked-die",
    "Приколотый кубик",
    "Выбери значение: кубики с ним нельзя перебрасывать",
    rule("freeze-pick"),
    { choice: "die" },
  ),

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
  gameCard(
    "extra-die",
    "Лишний кубик",
    "Кидай 6 кубиков: грань лишнего учитывается в комбинации",
    rule("extra-die"),
  ),
  gameCard(
    "inversion",
    "Искажение",
    "При подсчёте очков грани инвертируются: 1↔6, 2↔5, 3↔4",
    rule("score-inversion"),
  ),
  gameCard(
    "shift-up",
    "Сдвиг вверх",
    "При подсчёте грани сдвигаются: 1→2, …, 6→1; заменяет «Искажение»",
    rule("score-inversion", "shift-up"),
  ),
  gameCard(
    "shift-down",
    "Сдвиг вниз",
    "При подсчёте грани сдвигаются: 2→1, …, 1→6; заменяет «Искажение»",
    rule("score-inversion", "shift-down"),
  ),

  // ── Score and category rules ──────────────────────────────────────────────
  gameCard(
    "record-cap",
    "Планка рекорда",
    "Очки категории не выше лучшего уже записанного результата этой категории у любого игрока; если категория не закрыта — без потолка",
    rule("category-cap", "best-recorded"),
  ),
  gameCard(
    "repeat-category",
    "Повторный опыт",
    "Закрыл ту же категорию, что предыдущий игрок — очки ×2",
    rule("repeat-category-double"),
  ),
  gameCard(
    "taken-category-bonus",
    "Наследство",
    "Каждый следующий, кто закрывает уже занятую кем-то категорию, получает +6",
    rule("taken-category-bonus", "6"),
  ),
  gameCard(
    "taken-category-penalty",
    "Остывающая тема",
    "Каждый следующий в ту же категорию получает на 3 меньше своего броска",
    rule("taken-category-penalty", "3"),
  ),
  gameCard(
    "card-cost",
    "Дорогой протокол",
    "Разыграть протокол стоит 5 очков; итог не ниже нуля",
    rule("card-cost", "5"),
  ),

  // ── Turn and freeze rules ─────────────────────────────────────────────────
  gameCard(
    "auto-freeze-lowest",
    "Минимальная опора",
    "После броска сам замораживается наименьший кубик",
    rule("auto-freeze", "lowest"),
  ),
  gameCard(
    "auto-freeze-highest",
    "Максимальная опора",
    "После броска сам замораживается наибольший кубик",
    rule("auto-freeze", "highest"),
  ),
  gameCard(
    "frozen-penalty",
    "Плата за заморозку",
    "Каждый замороженный кубик снимает 1 очко при фиксации",
    rule("frozen-penalty", "1"),
  ),
  gameCard(
    "forced-reroll",
    "Обязательный повтор",
    "После первого броска обязан перебросить хотя бы раз",
    rule("forced-reroll"),
  ),

  // ── Card control ──────────────────────────────────────────────────────────
  gameCard(
    "before-first-roll",
    "До первого броска",
    "Протоколы можно объявлять только до первого броска хода",
    rule("card-timing", "before-roll"),
    { playableIn: ["Roll"] },
  ),
  gameCard(
    "cancel-one",
    "Отзыв протокола",
    "Отмени 1 активное правило",
    undefined,
    { action: "cancel-rule", choice: "rule" },
  ),
  gameCard(
    "cancel-two",
    "Двойной отзыв",
    "Отмени 2 активных правила",
    undefined,
    { action: "cancel-rules", actionValue: "2", choice: "rule-pair" },
  ),
  gameCard(
    "cancel-all",
    "Полная нейтрализация",
    "Отмени все наложенные правила",
    undefined,
    { action: "cancel-all-rules" },
  ),
  gameCard(
    "standings",
    "Уравнитель",
    "Единственный лидер не может играть протоколы; единственный последний может сыграть два за ход; при ничье правило молчит",
    rule("standings-card-limit"),
  ),
  gameCard(
    "first-round-lock",
    "Немой первый круг",
    "В первом круге протоколы нельзя играть",
    rule("card-lock-round", "1"),
  ),

  // ── Category swap ─────────────────────────────────────────────────────────
  gameCard(
    "swap-category",
    "Замена",
    "Поменяй местами две комбинации: статус и очки переходят",
    undefined,
    { action: "swap-category", choice: "category-pair" },
  ),
];

export const CARD_BY_ID: ReadonlyMap<CardId, Card> = new Map(
  CARD_CATALOG.map((entry) => [entry.id, entry]),
);

/** Number of cards in the starting hand (GDD §4). */
export const START_HAND = 3;

/** Maximum hand size (GDD §4). */
export const MAX_HAND = 4;

/** Seconds allowed for a forced discard (GDD §4). */
export const FORCED_DISCARD_SECONDS = 3;

export function createDeck(random: RandomFn = Math.random): CardId[] {
  return shuffle(
    CARD_CATALOG.map((entry) => entry.id),
    random,
  );
}

export interface DrawResult {
  drawn: CardId[];
  deck: CardId[];
  discard: CardId[];
}

/**
 * Draws cards. When the deck is empty, the discard pile is shuffled and
 * becomes the new deck (GDD §4: "1-2 reshuffles per session with 8 players").
 */
export function drawCards(
  deck: readonly CardId[],
  discard: readonly CardId[],
  count: number,
  random: RandomFn = Math.random,
): DrawResult {
  let pool = [...deck];
  let graveyard = [...discard];
  const drawn: CardId[] = [];

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
