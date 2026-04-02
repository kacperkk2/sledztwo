# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx ng serve          # Start dev server → http://localhost:4200 (bez prefiksu /sledztwo)
npm run build      # Production build → dist/sledztwo/
npm run watch      # Dev build in watch mode
npm test           # Run Jasmine/Karma tests (Chrome, port 9876)
```

## Before every commit

Build files for GitHub Pages before any git commit:

```bash
ng build --output-path docs --base-href /sledztwo/
cp docs/index.html docs/404.html
```

/docs files add to commit


## Architecture

**Sledztwo** is an Angular 14 app — a Polish mystery/investigation board game (adaptation of "Tajniacy"-style gameplay). Players work with a 5×5 grid of cards across 5 categories.

### Routing

- `/sledztwo` → random board
- `/sledztwo/:code` → board loaded from a shareable compressed code

### Key files

- **`src/app/app.properties.ts`** — single source of truth for all game data: card lists (PERSON, PLACE, ITEM, MOTIVE arrays with name + image path), and CONFIG constants (`CARDS_IN_ROW`, `ROWS`, `CARD_CODE_LENGTH`, `URL_ROOT`).
- **`src/app/services/board/board.service.ts`** — core game logic: random board generation, board state encoding/decoding to shareable URL codes, card swap handling.
- **`src/app/services/codec/codec.service.ts`** — base62 compression using `lz-string` for compact board representation in URLs.
- **`src/app/components/board/`** — main 5×5 grid component; handles card marking, swap mode, label toggling.
- **`src/app/dialogs/swap-card-dialog/`** — Angular Material dialog for picking replacement cards from the pool.

### Card categories

The board has 5 rows, each from a different pool defined in `app.properties.ts`:
- **PERSON** (~80 cards) — suspects/character types
- **PLACE** (~31 cards) — crime locations
- **ITEM** (~32 cards) — weapons/evidence
- **MOTIVE** (~30 cards) — criminal motives

Cards have `{ name: string, image: string }` shape. Images are served from `src/assets/compressed/{person,place,item,motive}/`.

### Asset workflow

Images are stored in two places:

- **`src/assets/original/{category}/`** — full-resolution source files; this is where cards are added or replaced
- **`src/assets/compressed/{category}/`** — optimized versions actually served by the app (400px wide, ~25-35KB JPEG)

**When adding or updating card images, always edit `original/` first, then generate the compressed copy:**

```bash
convert src/assets/original/{category}/nazwa.jpeg \
  -resize 400x -quality 55 -sampling-factor 4:2:0 \
  src/assets/compressed/{category}/nazwa.jpeg
```

Never edit `compressed/` directly — it is always derived from `original/`.

### Board state sharing

The board encodes its state (which cards are selected + marked) into a compressed base62 string passed as a URL path segment, allowing players to share board configurations via URL.
