# game-overrule-shared

Shared package for **Overrule**: domain types, pure game rules and the wire
contract used by both the client and the Colyseus server.

## What is inside

| Path | Purpose |
|------|---------|
| `src/types` | Domain types: dice, categories, phases, cards, players, events |
| `src/core` | Pure game rules: scoring, deck, dice, rules, freeze, turn, log |
| `src/protocol` | Client/server message contract |
| `src/utils` | Pure helpers (seeded shuffle) |
| `src/wire.ts` | Wire-state shape for the Colyseus room + room name constants |

The package contains **no IO, no DOM, no Colyseus dependency**. The wire
contract is deliberately a plain TypeScript interface: the client uses
`@colyseus/schema` 5 while the server uses Colyseus 0.17 / schema 4, so the
schema classes live on the server and are checked against `GameStateWire`.

## Build

The `dist/` directory is committed because consumers install this package
directly from GitHub and npm does not run a build for git dependencies.

```bash
npm install
npm run build
npm run typecheck
```

## Usage

```ts
import {
  OVERRULE_ROOM_NAME,
  scoreCategory,
  type GameStateWire,
  type Card,
} from "game-overrule-shared";
```
