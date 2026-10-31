/**
 * Перемешивание Фишера—Йетса. Возвращает новый массив, не мутируя исходный.
 * `random` параметризован, чтобы тесты были детерминированными.
 */
export function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const swapWith = Math.floor(random() * (index + 1));
        const current = result[index];
        result[index] = result[swapWith];
        result[swapWith] = current;
    }
    return result;
}
