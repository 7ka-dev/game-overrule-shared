"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OVERRULE_LOBBY_ROOM_NAME = exports.OVERRULE_ROOM_NAME = void 0;
/**
 * Wire contract for the Overrule room state.
 *
 * This file contains data shapes only, with no Colyseus dependency. The
 * client and server both use Colyseus 0.17 today, but keeping the contract as
 * plain TypeScript avoids coupling this package to a specific schema version.
 * The server defines its schema classes locally and checks them against this
 * contract at build time; the client uses the contract as the room state type.
 */
/** Overrule room name on the server (must match on client and server). */
exports.OVERRULE_ROOM_NAME = "overrule";
/** Lobby room name used by the client to list public rooms. */
exports.OVERRULE_LOBBY_ROOM_NAME = "lobby";
