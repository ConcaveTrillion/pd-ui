# New session — Scannos design for pgdp-prep

Attach this project (`pdomain-prep-for-pgdp`) and open `wf05/index.html`. The hyphen-join workbench is largely settled; the **Scannos** half of the global library is the next problem to crack and it's gnarlier than hyphens. I want to spend a session pulling on the tensions before drawing more pixels.

## What exists today

- **`wf05/index.html`** — the WF-05 canvas. Look at:
  - **L2 · Baseline · Scannos tab** — the current find/replace table (11 sample entries, single column of pairs, simple checkbox for "ignore case"). This is the legacy shape, lifted out of the textarea-on-/settings model.
  - **L3 · Dual-pane shell** — the unified library shell (side-nav, provenance, search). Scannos sits as one category in the rail but is currently a sketch; the rich content is shown on the Hyphens side.
  - **L4 · Promotion Inbox** — includes one scanno (`modem → modern`) from `gibbon-decline-v3` to illustrate the cross-bridge, but only loosely.
  - **L8 / L9 · Import / Export dialogs** — scannos are bundled with the rest of the library; format-wise we mention CSV as an option.
- **Sample data** lives in `wf05/variations.jsx` (constant `SCANNOS`, ~line 270): `tlie→the`, `thc→the`, `tbe→the`, `arid→and`, `aud→and`, `oi→of`, `ot→of`, `iii→in`, `rn→m`, `modem→modern`, `arc→are`.
- **Design tokens** in `design-system/tokens.css` — warm-charcoal palette, amber accent, status colours (`--exact`, `--fuzzy`, `--mismatch`, `--ocr`, `--gt`). Terminal-adjacent aesthetic; borders > shadows; Inter for UI, JetBrains Mono for anything code-shaped.
- **NOTES.md** in this folder explains the post-book-processing bridge — relevant because scannos may behave similarly (capture locally, resolve globally).

## Why scannos are harder than hyphens

The hyphen workbench gets away with a tidy UI because the universe of cases is tiny and well-bounded: only words that broke across a line. Scannos break all of that.

1. **Volume.** Real scanno lists run to hundreds or thousands of entries. The legacy textarea model collapses under this. Even L2's table won't scale past ~50 rows without grouping, search, virtualisation.
2. **False positives are catastrophic.** A bad hyphen rule produces an ugly word that proofers will catch. A bad scanno silently corrupts every page it touches. The review burden is asymmetric: every new scanno needs evidence + a "what would have changed" diff before it earns trust.
3. **Context-sensitivity.** `rn → m` is the canonical example: it fixes `cornrnand → command` but ruins `corner → corm`, `barn → bam`, `Bernard → Bemard`. So in practice scannos need at minimum word-boundary anchoring, often regex, sometimes negative lookbehind. The UI has to make that visible without scaring non-regex users.
4. **Case sensitivity** is real and per-rule, not a global toggle.
5. **Domain dependence.** `modem → modern` is correct for 18th-century history and catastrophically wrong for a tech manual. The provenance/scope question is sharper here than for hyphens — "this scanno belongs in the global library" needs a much higher bar than for hyphen rules.
6. **Order of application.** Rules chain: `tlie → the` followed by `the → tho` would compose unpredictably. Need to think about whether order is exposed, sorted, or whether we enforce a single-pass model.
7. **Enable vs delete.** A scanno that's gold for one project is poison for the next. You need per-project enable/disable, not just global delete. (Same kind of tension as hyphen rules, but louder.)
8. **Discoverability of new scannos.** Where do new scannos come from? Three plausible sources:
   - Manual (user notices `tlie` everywhere, adds it)
   - Promoted from a book's text-review pass (analogous to hyphen Inbox)
   - Auto-suggested by an OCR confidence pass — words the OCR engine flagged as low-confidence that fit a near-miss pattern
9. **Overlap with the dictionary.** Some "scannos" are just words the spellchecker doesn't know. When does a fix belong as a scanno (find/replace) vs as a dictionary addition (don't flag)?

## Open questions I want to discuss before designing

Let's actually talk through these. I want positions, not solutions yet.

- **Rule expressiveness ladder.** Do we offer one input type (literal string), three (literal / word-bounded / regex), or a power-user "advanced" toggle? What does the simple-mode preview need to show to keep the user from foot-gunning?
- **Trust gating.** Should scannos require explicit "preview the diff on this book" before being applied? Always, never, or only for new + unverified ones? How does that interact with `text_post_process` running automatically in the pipeline?
- **Promotion economics.** A hyphen rule earns global status when 3 books agree. What's the equivalent threshold for a scanno? Or do we never auto-promote scannos and always require an explicit "promote to global" with sample evidence?
- **Scope model.** Three layers (default / project / book), or two (global / project)? Do we expose all three in the UI or fold "book" into the per-book Settings tab the way hyphens already work?
- **The catastrophic-false-positive surface.** What's the UI for "this scanno will change 412 words across 387 pages — review before applying"? Inline preview list? Separate audit view? Block until reviewed?
- **OCR-confidence integration.** Should the library know which words the OCR engine was uncertain about, and suggest scannos from that pool? This is a different mental model than user-driven — closer to a queue you work through, like the hyphen Undecided list.
- **Regex affordance.** If we offer regex, how do we keep the 90% case (literal string) clean? Toggle? Mode chip? Auto-detect from a leading slash?
- **The textarea power-user lane.** The legacy /settings had textareas. Some users will want to paste 500 lines at once and not click through a wizard. How do we preserve that without making it the default path?
- **Per-book overrides.** A user disabling `rn → m` for one book because their text actually does contain `barn` — where does that override live, and how do we make sure it's not silently re-enabled when the user re-runs the pipeline?
- **Versioning.** If I promote `modem → modern` globally on Tuesday and a user processes a tech book on Wednesday, what happens? Do scannos have a "minimum confidence" / "this came from N books" badge so a project can opt out of low-evidence rules?

## What I want out of the session

1. Talk through the questions above. No artboards yet — just pin down which dimensions matter and which we can defer.
2. Pick a **mental model** for what a scanno IS (single literal find/replace? Pattern with context? Just a typed transformation rule?). The downstream UI falls out of that choice.
3. Sketch the **2–3 surfaces** scannos need (library table, promotion inbox bridge, in-pipeline preview/audit) and how they hand off.
4. Decide which existing patterns from the hyphen workbench transfer (provenance pills, side-nav category, dual-pane shell) and which need a different metaphor.

After we agree on the model, I'll come back and build the artboards into the `Library` section of WF-05 (slots `L10+` are open) or break it out into its own `WF-06`-adjacent canvas if it earns one.

## What NOT to do this session

- Don't draw a "better table." The table isn't the problem.
- Don't propose AI/ML auto-detection as the headline. It can be a source, not the whole story.
- Don't bolt on a regex tester. Bring it up only if we agree expressiveness is the right axis.
- Don't echo my framing back at me. Push on the bits I'm wrong about.
