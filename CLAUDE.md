# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projects

This repo contains two independent games:

- **`index.html`** — Tic Tac Toe, single-file browser game (no build step)
- **`blackjack/`** — Blackjack CLI game for Node.js (CommonJS, no dependencies)

## Running the games

**Tic Tac Toe:** Open `index.html` directly in a browser.

**Blackjack:**
```bash
cd blackjack
node index.js
```

No `npm install` needed — there are no external dependencies.

## Blackjack architecture

Entry point is `blackjack/index.js`, which instantiates and runs `Game`.

Data flows through four classes in `blackjack/src/`:

| Class | Responsibility |
|-------|---------------|
| `Card` | Holds suit + rank; `value` getter returns numeric value (aces always 11 here) |
| `Deck` | 52-card deck; auto-reshuffles when fewer than 10 cards remain |
| `Hand` | Holds cards; `value` getter handles ace reduction (11→1) to avoid bust |
| `Game` | Game loop, betting, player actions, dealer AI, balance tracking via `readline` |

Ace logic lives entirely in `Hand.value` — `Card.value` always returns 11 for aces; `Hand` reduces by 10 per ace as needed.

`Game.playRound()` mutates `this.balance` directly. `bet` is a local `let` variable that doubles in-place on double-down.

The deck resets itself inside `Deck.deal()` — no external reshuffle call needed.

## Tic Tac Toe architecture

Everything is in a single `<script>` block in `index.html`. State is three variables: `board` (9-element array), `current` (X/O), `gameOver`. Win detection iterates the 8 `WINS` combos on every move. Score persists in a `score` object across `init()` calls (restart doesn't reset score).
