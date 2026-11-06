# words.l3xj.com

Lexi's writing and the **Word Collector**, a numbered collection of quotes, on
[Payload](https://payloadcms.com) 3 (Next.js) with SQLite. One app serves the public site, the admin
page and an hourly Substack import.

## Pages

| Path | What it shows |
|---|---|
| `/` | Welcome window, a random quote, latest writing |
| `/writing`, `/w/<slug>` | All writing, one piece |
| `/quotes`, `/quotes/<n>`, `/quotes/random` | Word Collector with search and filters, one quote, a random quote |
| `/authors/<slug>` | An author's photo, links and quotes |
| `/feed.xml` | RSS of writing |
| `/admin` | Payload admin (not exposed publicly in production) |

## Content model

- **writings**: title, slug, kind, written on, excerpt, cover, rich-text body with images, origin
  (site or Substack), Substack link; drafts with autosave.
- **quotes**: permanent number (assigned automatically, never reused), text, author, source, source
  type and link, "why I love it" (rich text), added date, public flag, tags. A quote without text
  stays off the site.
- **authors**: name, slug, kind (public figure, creator, character, friend, me, uncredited), photo,
  note, links.
- **media**: uploaded images, resized to `thumb`, `card` and `wide`.

## Develop

```bash
cp .env.example .env            # set PAYLOAD_SECRET (openssl rand -hex 32)
npm install
npm run migrate                 # creates data/words.db from src/migrations
DISABLE_JOBS=true npm run dev   # http://localhost:3000, admin at /admin
```

Seed (first time only): `QUOTES_NOTE=<path to the quote note> DISABLE_JOBS=true npm run seed`.

Changing a collection: edit it, then `npm run migrate:create <name>` and commit the new file in
`src/migrations/`. The server applies pending migrations by itself when it starts in production.

## Deploy

GitHub Actions builds `ghcr.io/lexical-yoda/words` on every push to `main`. The image runs as a
single container with its state in one volume mounted at `/app/data`; a minimal compose file is
in [`examples/compose.yaml`](examples/compose.yaml). The real deployment configuration is kept
outside this repository.
