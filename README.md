# game-overrule-shared

Shared package for **Overrule**: domain types, pure game rules and the wire
contract used by both the client and the Colyseus server.

## What is inside

| Path | Purpose |
|------|---------|
| `src/types` | Domain types: dice, categories, phases, cards, players, events |
| `src/core` | Pure game rules: scoring, cards, deck, dice, rules, freeze, turn, log |
| `src/protocol` | Client/server message contract |
| `src/utils` | Pure helpers (seeded shuffle) |
| `src/wire.ts` | Wire-state shape for the Colyseus room + room name constants |

The package contains **no IO, no DOM, no Colyseus dependency**. The wire
contract is deliberately a plain TypeScript interface: the client and server
both use Colyseus 0.17 today, but keeping the contract schema-agnostic avoids
coupling this package to a schema version. Schema classes live on the server
and are checked against `GameStateWire` at build time.

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
  scoreWithRules,
  type GameStateWire,
  type Card,
} from "game-overrule-shared";
```

`scoreWithRules` is the single scoring pipeline shared by the authoritative
server and the client preview: base → face transforms → fixed bonuses →
multipliers → additive bonuses → category cap → penalties → `max(0)`.
