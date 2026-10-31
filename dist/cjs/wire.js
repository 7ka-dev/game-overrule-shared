"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OVERRULE_LOBBY_ROOM_NAME = exports.OVERRULE_ROOM_NAME = void 0;
/**
 * Проводной контракт состояния Overrule.
 *
 * Здесь только структура данных, без Colyseus: клиент остаётся на
 * `@colyseus/schema` 5, а сервер — на 0.17/schema 4, поэтому общий пакет
 * не может содержать schema-классы ни одной из версий. Сервер описывает
 * классы схемы локально и проверяет соответствие этому контракту, клиент
 * использует контракт как тип состояния комнаты.
 */
/** Имя комнаты Overrule на сервере (совпадает у клиента и сервера). */
exports.OVERRULE_ROOM_NAME = "overrule";
/** Имя лобби-комнаты, через которую клиент получает список открытых комнат. */
exports.OVERRULE_LOBBY_ROOM_NAME = "lobby";
