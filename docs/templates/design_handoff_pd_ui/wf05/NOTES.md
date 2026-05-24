# Notes · WF-05

## Cross-page hyphens + mismatched dashes — shared with post-book-processing

Two surfaces from this workbench flow downstream into **post-book processing**, a separate workflow (not `text_post_process`) that ships its own related but distinct UI built on these components:

1. **Cross-page hyphens** — line-break hyphens that straddle the foot of one page and the head of the next (sometimes with a running head, folio, or **footnote block** skipped in between). Captured here, decided there.
2. **Mismatched dash report** (V4) — same-word pairs that appear both joined and hyphenated. Resolution belongs to post-book because that's where the corpus-wide normalisation pass runs.

In WF-05 we **capture and visualise** both categories but leave the actual resolution to the downstream tool.

Implications:

- Keep cross-page cases as **first-class data**: `crossPage: { fromPage, toPage, skipped }` on the case object. Don't strip them.
- The visual indicator (`<PageBreak>` mono-pill in purple) is intentional: makes the case visibly different at a glance.
- The stat tile "2 cross-page · post-book" surfaces the count so the user knows the category exists; it doesn't have its own dedicated filter view here.
- The decision actions ("always join" / "keep") still apply if the user wants to resolve in-place — but the expected workflow is "leave for post-book processing".
- The mismatched dash report (V4) uses the same `MismatchRow` component that post-book will consume.

Components that need to render `crossPage` correctly: `ContextSnippet`, `HyphenCard` header pip + page reference, `QueueCase`, `AutoJoinedRow` (when an auto-joined word has any cross-page instances).

Shared with post-book: `ContextSnippet`, `PageBreak`, `HyphenCard`, `AutoJoinedRow`, `MismatchRow`, the ngrams sparkline. All exported via `window.*`.

## Ngrams API options (for the inline sparkline)

There is no official Google Books Ngrams API. Options if/when this gets built:

1. **Unofficial JSON endpoint** — `https://books.google.com/ngrams/json?content=WORD1,WORD2&year_start=1700&year_end=2019&corpus=en-2019&smoothing=3` returns the same time-series JSON the chart uses.
   - ✅ free, no key, immediate
   - ❌ undocumented, throttled (~1 req/sec before rate-limiting kicks in), Google has broken or changed its response shape several times
   - Good for prototyping; bad for production
2. **[Phrasefinder.io](https://phrasefinder.io/)** — public API built on top of the Google Books Ngrams corpus.
   - ✅ free tier ~3 req/sec, documented, returns counts + match scores per year
   - ❌ third-party dependency; corpus snapshot is from 2012
3. **Raw corpus dump** — Google publishes the full Ngrams dataset (1-gram, 2-gram, …) as `.gz` files for download.
   - ✅ you own the data; no rate limits; can pre-index just the (head, tail) pairs you care about
   - ❌ terabytes raw; one-time setup work to filter down to hyphen pairs (probably <100MB indexed)

For pd-prep specifically — the hyphen workbench needs frequency for *pairs* of forms (`afterwards` vs `after-wards`). That's a 1-gram or 2-gram lookup per case. The raw-corpus path is probably the right answer long-term: a one-time job to extract all `wordA / word-A / word A` triples from the 1-gram + 2-gram dumps, store them as a single ~50MB SQLite or DuckDB file, ship it with the app.

Until then: the unofficial JSON endpoint is fine for the first version, with a fallback to Phrasefinder if it gets rate-limited.

## In-card sparkline

Renders `joined` (green) vs `hyphenated` (amber) frequency from 1700–2020 plus a one-line verdict (e.g. *"today crossed to-day in the 1920s"*). The full Ngrams chart is one click away via the `ngrams ↗` link as an escape hatch.
