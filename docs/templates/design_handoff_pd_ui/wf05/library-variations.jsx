// library-variations.jsx — WF-05 Global Settings Library · options
//
// L3 · Dual-pane library — side-nav with category tree + provenance column
// L4 · Promotion Inbox — per-book report → global library bridge
// L5 · Universal search — command-bar style search across all categories
// L6 · Bulk editor — paste-from-list & JSON view with diff preview
// L7 · Empty state — fresh install with starter packs
//
// All reuse: Button, Input, Icon, Pip, Kbd from ui.jsx + variations.jsx.
// Theme-aware. No state — designs are static frames.

const { useState: useS5Lib } = React;

/* ====================================================================
   Shared data — provenance-rich rule list
==================================================================== */

// 4 provenance kinds:
//   default  · shipped with the app, immutable unless overridden
//   user     · added by a user (signed)
//   imported · came in via a JSON / CSV import
//   learned  · promoted from a per-book Hyphen Report decision (WF-05 V3/V5)
const PROV_META = {
  default:  { color: 'ink-3',  label: 'default'  },
  user:     { color: 'accent', label: 'user'     },
  imported: { color: 'ocr',    label: 'imported' },
  learned:  { color: 'gt',     label: 'learned'  },
};

// 17-row "Always join" list, demonstrating all 4 provenance kinds + a
// freshly-learned row from the current book.
const ALWAYS_JOIN_PROV = [
  { word: 'after-noon',    prov: 'default',  source: 'built-in v1.0',           usedIn: 42, lastSeen: '4m', books: 287 },
  { word: 'any-thing',     prov: 'default',  source: 'built-in v1.0',           usedIn: 19, lastSeen: '4m', books: 312 },
  { word: 'any-where',     prov: 'default',  source: 'built-in v1.0',           usedIn: 7,  lastSeen: '4m', books: 198 },
  { word: 'some-thing',    prov: 'default',  source: 'built-in v1.0',           usedIn: 28, lastSeen: '4m', books: 301 },
  { word: 'some-where',    prov: 'default',  source: 'built-in v1.0',           usedIn: 5,  lastSeen: '4m', books: 162 },
  { word: 'to-gether',     prov: 'default',  source: 'built-in v1.0',           usedIn: 33, lastSeen: '4m', books: 274 },
  { word: 'with-out',      prov: 'default',  source: 'built-in v1.0',           usedIn: 47, lastSeen: '4m', books: 341 },
  { word: 'with-in',       prov: 'default',  source: 'built-in v1.0',           usedIn: 38, lastSeen: '4m', books: 322 },
  { word: 'to-morrow',     prov: 'default',  source: 'built-in v1.0',           usedIn: 6,  lastSeen: '4m', books: 213 },
  { word: 'to-night',      prov: 'default',  source: 'built-in v1.0',           usedIn: 4,  lastSeen: '4m', books: 207 },
  { word: 'him-self',      prov: 'default',  source: 'built-in v1.0',           usedIn: 22, lastSeen: '4m', books: 290 },
  { word: 'her-self',      prov: 'default',  source: 'built-in v1.0',           usedIn: 11, lastSeen: '4m', books: 261 },
  { word: 'common-wealth', prov: 'learned',  source: 'belloc-survivals',        usedIn: 11, lastSeen: '4m', books: 7,   added: 'just now' },
  { word: 'fore-shadowed', prov: 'learned',  source: 'belloc-survivals',        usedIn: 6,  lastSeen: '4m', books: 14,  added: 'just now' },
  { word: 'cuck-field',    prov: 'learned',  source: 'belloc-survivals',        usedIn: 4,  lastSeen: '4m', books: 1,   added: 'just now' },
  { word: 'my-self',       prov: 'imported', source: 'gutenberg-classics.json', usedIn: 14, lastSeen: '4m', books: 198, added: 'Apr 4' },
  { word: 'after-wards',   prov: 'user',     source: 'jsmith',                  usedIn: 18, lastSeen: '4m', books: 41,  added: 'Apr 12' },
];

// 6 pending promotions for the Inbox view, drawn from 3 different books.
const PENDING = [
  {
    id: 1, kind: 'always-join', word: 'common-wealth', joinedAs: 'commonwealth',
    book: 'belloc-survivals', evidence: 1, freq: { j: 11, h: 0 },
    decidedBy: 'jsmith', decidedAt: '4m ago',
    rationale: '"✓ Always join" · ngrams 50:1', crossPage: true,
  },
  {
    id: 2, kind: 'always-join', word: 'fore-shadowed', joinedAs: 'foreshadowed',
    book: 'belloc-survivals', evidence: 1, freq: { j: 6, h: 0 },
    decidedBy: 'jsmith', decidedAt: '4m ago',
    rationale: '"✓ Always join" · 99% confidence', crossPage: true,
  },
  {
    id: 3, kind: 'always-join', word: 'after-wards', joinedAs: 'afterwards',
    book: 'belloc-survivals', evidence: 3, freq: { j: 18, h: 0 },
    decidedBy: 'jsmith', decidedAt: '4m ago',
    rationale: '"✓ Always join" · 97% confidence',
  },
  {
    id: 4, kind: 'always-keep', word: 'to-day', joinedAs: 'today',
    book: 'belloc-survivals', evidence: 5, freq: { j: 5, h: 1 },
    decidedBy: 'jsmith', decidedAt: '4m ago',
    rationale: '"Always keep" · author favours archaic form',
    conflict: 'Conflicts with default rule "to-day → today"',
  },
  {
    id: 5, kind: 'beginning', word: 'archi-',
    book: 'brontë-villette', evidence: 3, freq: { j: 0, h: 0 },
    decidedBy: 'jsmith', decidedAt: '2h ago',
    rationale: '3 different words joined ("archibishop", "architrave", "archipelago")',
  },
  {
    id: 6, kind: 'scanno', word: 'modem', joinedAs: 'modern',
    book: 'gibbon-decline-v3', evidence: 5, freq: { j: 0, h: 0 },
    decidedBy: 'amackay', decidedAt: 'yesterday',
    rationale: '"modem" doesn\'t exist in 18th c. corpus',
  },
];

const STARTER_PACKS = [
  {
    id: 'gut',
    title: 'Project Gutenberg defaults',
    sub: 'Recommended · used by 4,200+ projects',
    counts: { begin: 20, end: 10, join: 18, keep: 12, scannos: 11 },
    chips: ['after-', 'self-', '-ship', '-ness', 'with-out', 'any-thing', 'tlie→the'],
    note: 'Conservative. Good baseline for English-language books 1700-present.',
    rec: true,
  },
  {
    id: '19c',
    title: '19th-century English',
    sub: 'Pre-1920 spelling preserved',
    counts: { begin: 14, end: 8,  join: 9,  keep: 22, scannos: 24 },
    chips: ['to-day', 'sister-in-law', 'on-going', 'co-operate', 'modem→modern'],
    note: 'Keeps archaic compound forms ("to-day", "co-operate") intact.',
  },
  {
    id: 'sci',
    title: 'Scientific & mathematical',
    sub: 'For technical texts',
    counts: { begin: 31, end: 12, join: 5,  keep: 47, scannos: 8 },
    chips: ['semi-', 'pseudo-', 'non-linear', 'co-efficient', '-axis', 'sin-1'],
    note: 'Preserves hyphenated technical terms; broader prefix coverage.',
  },
];

/* ====================================================================
   Shared atoms
==================================================================== */

const ProvPip = ({ kind, source, dense }) => {
  const m = PROV_META[kind];
  const v = `var(--${m.color})`;
  return (
    <span title={`${m.label} · ${source}`} className="mono" style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: dense ? '1px 6px' : '2px 7px', borderRadius: 99,
      fontSize: dense ? 9.5 : 10, fontWeight: 600, letterSpacing: '.02em',
      color: v,
      background: `color-mix(in srgb, ${v} 12%, transparent)`,
      border: `1px solid color-mix(in srgb, ${v} 32%, transparent)`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: v }} />
      {m.label}
    </span>
  );
};

const SearchBox = ({ placeholder, hint, value, big }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    height: big ? 40 : 30, padding: big ? '0 14px' : '0 10px',
    background: 'var(--bg-sunk)', border: '1px solid var(--border-2)',
    borderRadius: 6,
  }}>
    <Icon name="search" size={big ? 15 : 13} style={{ color: 'var(--ink-3)' }} />
    <span style={{
      flex: 1, fontFamily: 'var(--mono-font)',
      fontSize: big ? 14 : 12,
      color: value ? 'var(--ink-1)' : 'var(--ink-4)',
    }}>{value || placeholder}</span>
    {hint ? <Kbd>{hint}</Kbd> : null}
  </div>
);

/* ====================================================================
   Library shell — left rail nav (reused by L3/L4/L5/L6)
==================================================================== */

const LIB_TREE = [
  {
    group: 'Hyphen rules', items: [
      { id: 'beginnings', name: 'Beginnings', count: 20, tone: 'block' },
      { id: 'endings',    name: 'Endings',    count: 10, tone: 'para' },
      { id: 'always-join',name: 'Always join',count: 17, tone: 'exact' },
      { id: 'always-keep',name: 'Always keep',count: 13, tone: 'fuzzy' },
    ],
  },
  {
    group: 'Text post-process', items: [
      { id: 'scannos',    name: 'OCR scannos', count: 11, tone: 'mismatch' },
      { id: 'dict',       name: 'Custom dictionary', count: 84, tone: 'ink-3' },
    ],
  },
  {
    group: 'Bridges', items: [
      { id: 'inbox',   name: 'Pending from books', count: 6, badge: 'new', tone: 'gt' },
      { id: 'imports', name: 'Imported sets',      count: 3, tone: 'ocr' },
    ],
  },
];

const LibraryRail = ({ activeId }) => (
  <aside style={{
    width: 230, flex: '0 0 auto',
    borderRight: '1px solid var(--border-1)',
    background: 'var(--bg-surface)',
    overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 4,
  }}>
    <div style={{ padding: '14px 14px 10px' }}>
      <SearchBox placeholder="Filter rules…" hint="⌘F" />
    </div>
    {LIB_TREE.map(g => (
      <div key={g.group} style={{ paddingBottom: 4 }}>
        <div style={{
          padding: '6px 18px 4px', fontSize: 9.5, fontWeight: 700,
          letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-4)',
        }}>{g.group}</div>
        {g.items.map(it => {
          const on = it.id === activeId;
          const tone = it.tone === 'ink-3' ? 'var(--ink-3)' : `var(--${it.tone})`;
          return (
            <div key={it.id} style={{
              display: 'grid', gridTemplateColumns: '12px 1fr auto',
              gap: 9, alignItems: 'center',
              padding: '6px 16px 6px 14px',
              background: on ? 'color-mix(in srgb, var(--accent) 9%, transparent)' : 'transparent',
              borderLeft: on ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: tone }} />
              <span style={{
                fontSize: 12, color: on ? 'var(--ink-1)' : 'var(--ink-2)',
                fontWeight: on ? 600 : 500,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {it.name}
                {it.badge ? (
                  <span className="mono" style={{
                    padding: '0 5px', borderRadius: 99,
                    background: 'var(--gt)', color: 'var(--bg-page)',
                    fontSize: 9, fontWeight: 700, letterSpacing: '.03em',
                  }}>{it.badge}</span>
                ) : null}
              </span>
              <span className="mono" style={{
                fontSize: 10.5, color: on ? 'var(--ink-2)' : 'var(--ink-4)',
              }}>{it.count}</span>
            </div>
          );
        })}
      </div>
    ))}
    <div style={{ flex: 1 }} />
    <div style={{
      padding: '10px 16px', borderTop: '1px solid var(--border-1)',
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 11, color: 'var(--ink-3)',
    }}>
      <Icon name="info" size={12} />
      <span>v2.4 · synced 4m ago</span>
    </div>
  </aside>
);

const LibraryShell = ({ theme, activeId, breadcrumb, title, actions, children }) => (
  <div className="pgd" data-theme={theme} style={{
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', background: 'var(--bg-page)',
  }}>
    <TopNav />
    <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '18px 28px 14px',
        borderBottom: '1px solid var(--border-1)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--ink-3)' }}>
            <span style={{ cursor: 'pointer' }}>Settings</span>
            <Icon name="chevR" size={11} />
            <span style={{ cursor: 'pointer' }}>Library</span>
            {breadcrumb ? (
              <>
                <Icon name="chevR" size={11} />
                <span className="mono" style={{ color: 'var(--ink-2)' }}>{breadcrumb}</span>
              </>
            ) : null}
          </div>
          <h1 style={{ marginTop: 6, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink-1)' }}>
            {title}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>{actions}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <LibraryRail activeId={activeId} />
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </main>
  </div>
);

/* ====================================================================
   L3 · Dual-pane library — Always join + provenance column
==================================================================== */

const ProvFilters = () => {
  const filters = [
    { id: 'all', label: 'All', count: 17, active: true },
    { id: 'default', kind: 'default', count: 12 },
    { id: 'user', kind: 'user', count: 1 },
    { id: 'imported', kind: 'imported', count: 1 },
    { id: 'learned', kind: 'learned', count: 3 },
  ];
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {filters.map(f => {
        const m = f.kind ? PROV_META[f.kind] : null;
        const tone = m ? `var(--${m.color})` : 'var(--ink-2)';
        return (
          <span key={f.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 9px', borderRadius: 99,
            fontSize: 11, fontWeight: 500,
            background: f.active ? 'var(--bg-raised)' : 'transparent',
            border: f.active ? '1px solid var(--border-2)' : '1px solid var(--border-1)',
            color: f.active ? 'var(--ink-1)' : 'var(--ink-3)',
            cursor: 'pointer',
          }}>
            {m ? <span style={{ width: 6, height: 6, borderRadius: 99, background: tone }} /> : null}
            <span style={{ textTransform: 'capitalize' }}>{f.label || m.label}</span>
            <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 10 }}>{f.count}</span>
          </span>
        );
      })}
    </div>
  );
};

const QuickAddRow = () => (
  <div style={{
    display: 'grid', gridTemplateColumns: '1fr 140px auto',
    gap: 10, alignItems: 'center',
    padding: '10px 20px',
    background: 'color-mix(in srgb, var(--accent) 5%, var(--bg-surface))',
    borderBottom: '1px solid color-mix(in srgb, var(--accent) 30%, var(--border-1))',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      height: 30, padding: '0 10px',
      background: 'var(--bg-sunk)', border: '1px solid var(--accent)', borderRadius: 5,
      boxShadow: '0 0 0 2px color-mix(in srgb, var(--accent) 22%, transparent)',
    }}>
      <Icon name="plus" size={13} style={{ color: 'var(--accent)' }} />
      <span style={{ flex: 1, fontFamily: 'var(--mono-font)', fontSize: 12.5, color: 'var(--ink-1)' }}>
        any-time<span style={{ color: 'var(--accent)' }}>|</span>
      </span>
      <span style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>head-tail form</span>
    </div>
    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
      → joined as <span style={{ color: 'var(--exact)', fontWeight: 600 }}>anytime</span>
    </span>
    <div style={{ display: 'flex', gap: 6 }}>
      <Button variant="ghost" size="sm">Cancel</Button>
      <Button variant="primary" size="sm" icon="check">Add <Kbd>↵</Kbd></Button>
    </div>
  </div>
);

const RuleRow = ({ r, dim, hot }) => {
  const m = PROV_META[r.prov];
  const isLearned = r.prov === 'learned';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 96px 1fr 130px 70px',
      gap: 14, alignItems: 'center',
      padding: '8px 20px', borderBottom: '1px solid var(--border-1)',
      background: hot ? 'color-mix(in srgb, var(--gt) 6%, transparent)' : 'transparent',
      opacity: dim ? 0.55 : 1,
    }}>
      <span className="mono" style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-1)' }}>
        {r.word}
      </span>
      <ProvPip kind={r.prov} source={r.source} />
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {r.source}
        {r.added ? <span style={{ color: 'var(--ink-4)' }}> · {r.added}</span> : null}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--ink-3)' }}>
        <span title="In this book">
          <span style={{ color: 'var(--ink-1)', fontWeight: 600 }} className="mono">{r.usedIn}</span>
          <span className="mono"> here</span>
        </span>
        <span style={{ color: 'var(--ink-4)' }}>·</span>
        <span title="Across all your books" className="mono">
          {r.books} books
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <Button variant="ghost" size="sm" icon="search" />
        <Button variant="ghost" size="sm">
          <Icon name="moreH" size={13} />
        </Button>
      </div>
    </div>
  );
};

const LibL3 = ({ theme }) => (
  <LibraryShell
    theme={theme}
    activeId="always-join"
    breadcrumb="Hyphen rules · Always join"
    title="Always join · 17"
    actions={
      <>
        <Button variant="ghost" size="sm" icon="download">Export</Button>
        <Button variant="ghost" size="sm" icon="upload">Import</Button>
        <Button variant="primary" size="sm" icon="check">Save</Button>
      </>
    }
  >
    <div style={{ padding: '18px 28px 8px' }}>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55, maxWidth: 720 }}>
        Specific word pairs (<span className="mono" style={{ color: 'var(--ink-2)' }}>head-tail</span>) that are
        always joined when broken across a line. Applies to every new project — per-book overrides live in
        the project's Settings tab.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginTop: 14 }}>
        <div style={{ flex: 1, maxWidth: 360 }}>
          <SearchBox placeholder="Search 17 rules…" hint="⌘F" />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <ProvFilters />
        </div>
      </div>
    </div>

    <div style={{
      margin: '6px 28px 28px',
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
      borderRadius: 9, overflow: 'hidden',
    }}>
      {/* Column header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 96px 1fr 130px 70px',
        gap: 14,
        padding: '8px 20px', background: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-1)',
        fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
        textTransform: 'uppercase', color: 'var(--ink-4)',
      }}>
        <span>Word</span>
        <span>Provenance</span>
        <span>Source · added</span>
        <span>Usage</span>
        <span style={{ textAlign: 'right' }}>·</span>
      </div>

      {/* Quick-add — in-progress */}
      <QuickAddRow />

      {/* Learned-from-current-book group header */}
      <div style={{
        padding: '8px 20px',
        background: 'color-mix(in srgb, var(--gt) 8%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--gt) 30%, var(--border-1))',
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 11, color: 'var(--ink-2)',
      }}>
        <Icon name="sparkles" size={12} style={{ color: 'var(--gt)' }} />
        <span style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em',
          textTransform: 'uppercase', color: 'var(--gt)',
        }}>Just learned</span>
        <span style={{ color: 'var(--ink-3)' }}>· 3 new from <span className="mono" style={{ color: 'var(--ink-1)' }}>belloc-survivals</span></span>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm">View source</Button>
      </div>
      {ALWAYS_JOIN_PROV.filter(r => r.prov === 'learned').map(r => (
        <RuleRow key={r.word} r={r} hot />
      ))}

      {/* Rest of the list */}
      <div style={{
        padding: '8px 20px', background: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-1)',
        fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em',
        textTransform: 'uppercase', color: 'var(--ink-4)',
      }}>Existing</div>
      {ALWAYS_JOIN_PROV.filter(r => r.prov !== 'learned').map(r => (
        <RuleRow key={r.word} r={r} />
      ))}
    </div>
  </LibraryShell>
);

/* ====================================================================
   L4 · Promotion Inbox — per-book → global library bridge
==================================================================== */

const KindPill = ({ kind }) => {
  const palette = {
    'always-join': { color: 'var(--exact)',    label: 'always-join' },
    'always-keep': { color: 'var(--fuzzy)',    label: 'always-keep' },
    'beginning':   { color: 'var(--block)',    label: 'beginning'   },
    'ending':      { color: 'var(--para)',     label: 'ending'      },
    'scanno':      { color: 'var(--mismatch)', label: 'scanno'      },
  };
  const p = palette[kind] || palette['always-join'];
  return (
    <span className="mono" style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 4,
      fontSize: 10.5, fontWeight: 600,
      color: p.color,
      background: `color-mix(in srgb, ${p.color} 12%, transparent)`,
      border: `1px solid color-mix(in srgb, ${p.color} 33%, transparent)`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: p.color }} />
      {p.label}
    </span>
  );
};

const InboxCard = ({ p, checked }) => (
  <div style={{
    background: p.conflict
      ? 'color-mix(in srgb, var(--mismatch) 5%, var(--bg-surface))'
      : 'var(--bg-surface)',
    border: `1px solid ${p.conflict
      ? 'color-mix(in srgb, var(--mismatch) 35%, var(--border-1))'
      : 'var(--border-1)'}`,
    borderRadius: 9, padding: '14px 16px',
    display: 'grid', gridTemplateColumns: '20px 1fr 280px',
    gap: 14, alignItems: 'start',
  }}>
    {/* Checkbox */}
    <span style={{
      width: 16, height: 16, borderRadius: 3, marginTop: 2,
      background: checked ? 'var(--accent)' : 'var(--bg-raised)',
      border: `1px solid ${checked ? 'var(--accent)' : 'var(--border-2)'}`,
      display: 'grid', placeItems: 'center', color: 'var(--accent-ink)',
    }}>
      {checked ? <Icon name="check" size={10} stroke={3} /> : null}
    </span>

    {/* Main */}
    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <KindPill kind={p.kind} />
        {p.crossPage ? <Pip tone="gt">cross-page</Pip> : null}
        <span className="mono" style={{
          padding: '3px 10px', borderRadius: 5,
          background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
          fontSize: 13.5, fontWeight: 600, color: 'var(--ink-1)',
        }}>
          {p.word}
        </span>
        {p.joinedAs ? (
          <>
            <Icon name="arrowR" size={12} style={{ color: 'var(--ink-4)' }} />
            <span className="mono" style={{
              padding: '3px 10px', borderRadius: 5,
              fontSize: 13.5, fontWeight: 600,
              color: p.kind === 'always-keep' ? 'var(--fuzzy)' : 'var(--exact)',
              background: `color-mix(in srgb, ${p.kind === 'always-keep' ? 'var(--fuzzy)' : 'var(--exact)'} 12%, transparent)`,
              border: `1px solid color-mix(in srgb, ${p.kind === 'always-keep' ? 'var(--fuzzy)' : 'var(--exact)'} 35%, transparent)`,
            }}>{p.joinedAs}</span>
          </>
        ) : null}
      </div>

      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="file" size={11} />
        <span style={{ color: 'var(--ink-1)' }}>{p.book}</span>
        <span style={{ color: 'var(--ink-4)' }}>·</span>
        <span>{p.evidence === 1 ? '1 instance' : `${p.evidence} instances`}</span>
        <span style={{ color: 'var(--ink-4)' }}>·</span>
        <span>{p.freq.j}× joined / {p.freq.h}× hyphen elsewhere</span>
        <span style={{ color: 'var(--ink-4)' }}>·</span>
        <span>by {p.decidedBy} · {p.decidedAt}</span>
      </div>

      <div style={{ fontSize: 11.5, color: 'var(--ink-2)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <Icon name="info" size={11} style={{ color: 'var(--ink-4)', marginTop: 2, flex: '0 0 auto' }} />
        <span>{p.rationale}</span>
      </div>

      {p.conflict ? (
        <div style={{
          padding: '6px 10px', borderRadius: 5,
          background: 'color-mix(in srgb, var(--mismatch) 12%, transparent)',
          border: '1px solid color-mix(in srgb, var(--mismatch) 35%, transparent)',
          fontSize: 11, color: 'var(--mismatch)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="alert" size={11} />
          <span style={{ fontWeight: 600 }}>{p.conflict}</span>
          <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>· promotion will override</span>
        </div>
      ) : null}
    </div>

    {/* Actions */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'stretch' }}>
      <Button variant="primary" size="sm" icon="check">Promote to global</Button>
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="outline" size="sm" full>Book only</Button>
        <Button variant="ghost" size="sm" full>
          <span style={{ color: 'var(--ink-3)' }}>Dismiss</span>
        </Button>
      </div>
    </div>
  </div>
);

const LibL4 = ({ theme }) => (
  <LibraryShell
    theme={theme}
    activeId="inbox"
    breadcrumb="Bridges · Pending from books"
    title="Inbox · 6 pending"
    actions={
      <>
        <Button variant="ghost" size="sm" icon="refresh">Refresh</Button>
        <Button variant="outline" size="sm" icon="x">Dismiss all</Button>
        <Button variant="primary" size="sm" icon="check">Promote selected · 3</Button>
      </>
    }
  >
    <div style={{ padding: '18px 28px 8px' }}>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.55, maxWidth: 720 }}>
        Decisions made in per-book Hyphen Reports queue up here before they enter the global library.
        Review the evidence, then <b>Promote</b> to apply across all future projects, keep as <b>Book only</b>,
        or <b>Dismiss</b> to discard.
      </div>

      {/* Filter bar */}
      <div style={{
        marginTop: 14, padding: '10px 12px',
        background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Filter
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 9px', borderRadius: 99,
          background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
          fontSize: 11, color: 'var(--ink-1)',
        }}>
          <Icon name="folder" size={11} style={{ color: 'var(--ink-3)' }} />
          All books · 3
          <Icon name="chevD" size={10} style={{ color: 'var(--ink-4)' }} />
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 9px', borderRadius: 99,
          background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
          fontSize: 11, color: 'var(--ink-1)',
        }}>
          All kinds · 3
          <Icon name="chevD" size={10} style={{ color: 'var(--ink-4)' }} />
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>
          <span style={{ color: 'var(--ink-1)', fontWeight: 600 }}>3 of 6</span> selected
        </span>
      </div>

      {/* Group: belloc-survivals */}
      <div style={{ marginTop: 18 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 4px',
          fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)',
        }}>
          <Icon name="folder" size={13} style={{ color: 'var(--accent)' }} />
          <span className="mono" style={{ color: 'var(--ink-1)' }}>belloc-survivals</span>
          <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>· 4 decisions · 4m ago</span>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" size="sm">Select all in book</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PENDING.filter(p => p.book === 'belloc-survivals').map((p, i) => (
            <InboxCard key={p.id} p={p} checked={i < 3} />
          ))}
        </div>
      </div>

      {/* Group: brontë-villette */}
      <div style={{ marginTop: 22 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 4px',
          fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)',
        }}>
          <Icon name="folder" size={13} style={{ color: 'var(--ink-3)' }} />
          <span className="mono" style={{ color: 'var(--ink-1)' }}>brontë-villette</span>
          <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>· 1 decision · 2h ago</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PENDING.filter(p => p.book === 'brontë-villette').map(p => (
            <InboxCard key={p.id} p={p} />
          ))}
        </div>
      </div>

      {/* Group: gibbon */}
      <div style={{ marginTop: 22, paddingBottom: 28 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 4px',
          fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)',
        }}>
          <Icon name="folder" size={13} style={{ color: 'var(--ink-3)' }} />
          <span className="mono" style={{ color: 'var(--ink-1)' }}>gibbon-decline-v3</span>
          <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>· 1 decision · yesterday · by amackay</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PENDING.filter(p => p.book === 'gibbon-decline-v3').map(p => (
            <InboxCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </div>
  </LibraryShell>
);

/* ====================================================================
   L5 · Universal search — command-bar across all categories
==================================================================== */

const SearchHit = ({ word, cat, catTone, sub, meta, prov, hot }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '14px 1fr 120px 130px 84px 70px',
    gap: 12, alignItems: 'center',
    padding: '9px 16px',
    background: hot ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
    borderLeft: hot ? '2px solid var(--accent)' : '2px solid transparent',
    borderBottom: '1px solid var(--border-1)',
    cursor: 'pointer',
  }}>
    <span style={{ width: 6, height: 6, borderRadius: 99, background: `var(--${catTone})` }} />
    <div style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span className="mono" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-1)' }}>
        {word}
      </span>
      {sub ? <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{sub}</span> : null}
    </div>
    <span className="mono" style={{ fontSize: 10.5, color: `var(--${catTone})`, fontWeight: 500 }}>{cat}</span>
    <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{meta}</span>
    {prov ? <ProvPip kind={prov} source="" dense /> : <span />}
    <div style={{ textAlign: 'right' }}>
      {hot ? <Kbd>↵</Kbd> : <Icon name="chevR" size={12} style={{ color: 'var(--ink-4)' }} />}
    </div>
  </div>
);

const SearchGroup = ({ title, count, tone, children, more }) => (
  <div style={{ marginBottom: 6 }}>
    <div style={{
      padding: '10px 16px 6px',
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
      textTransform: 'uppercase', color: 'var(--ink-4)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: `var(--${tone})` }} />
      <span style={{ color: 'var(--ink-3)' }}>{title}</span>
      <span className="mono" style={{ color: 'var(--ink-4)' }}>· {count}</span>
      <div style={{ flex: 1 }} />
      {more ? <span style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'none', letterSpacing: 0, cursor: 'pointer' }}>{more}</span> : null}
    </div>
    {children}
  </div>
);

const LibL5 = ({ theme }) => (
  <LibraryShell
    theme={theme}
    activeId={null}
    breadcrumb="Search · &quot;after&quot;"
    title="Find anything"
    actions={
      <>
        <Button variant="ghost" size="sm" icon="download">Export</Button>
        <Button variant="primary" size="sm" icon="plus">New rule</Button>
      </>
    }
  >
    <div style={{ padding: '24px 32px 8px', maxWidth: 920, width: '100%' }}>
      {/* Big search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        height: 52, padding: '0 18px',
        background: 'var(--bg-surface)',
        border: '2px solid var(--accent)',
        boxShadow: '0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent), var(--shadow-floating)',
        borderRadius: 10,
      }}>
        <Icon name="search" size={18} style={{ color: 'var(--accent)' }} />
        <span style={{
          flex: 1, fontFamily: 'var(--mono-font)', fontSize: 16, color: 'var(--ink-1)',
        }}>
          after
          <span style={{
            display: 'inline-block', width: 2, height: 18, marginLeft: 1,
            background: 'var(--accent)', verticalAlign: 'middle',
            animation: 'pgd-pulse 1.2s ease-in-out infinite',
          }} />
        </span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>9 hits in 4 categories</span>
        <Button variant="ghost" size="sm">
          <Icon name="x" size={12} />
        </Button>
      </div>

      <div style={{
        marginTop: 10, display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--ink-3)',
      }}>
        <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> navigate</span>
        <span><Kbd>↵</Kbd> edit</span>
        <span><Kbd>⌘↵</Kbd> open in category</span>
        <span><Kbd>⌘N</Kbd> create rule from query</span>
        <div style={{ flex: 1 }} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '3px 8px', borderRadius: 5,
          background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
        }}>
          <Icon name="check" size={11} stroke={3} style={{ color: 'var(--exact)' }} />
          Match in head, tail, or replacement
        </span>
      </div>
    </div>

    {/* Results */}
    <div style={{
      margin: '12px 32px 28px',
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
      borderRadius: 9, overflow: 'hidden',
      maxWidth: 920, width: 'calc(100% - 64px)',
    }}>
      <SearchGroup title="Always join" count={4} tone="exact" more="see all 17 →">
        <SearchHit word="after-noon" cat="always-join" catTone="exact"
          meta="42× in book · 287 books" prov="default" hot />
        <SearchHit word="after-wards" cat="always-join" catTone="exact"
          sub={<span>— added by <span className="mono">jsmith</span></span>}
          meta="18× in book · 41 books" prov="user" />
      </SearchGroup>

      <SearchGroup title="Beginnings" count={1} tone="block">
        <SearchHit word="after-" cat="beginning" catTone="block"
          sub={<span>— joins any word</span>}
          meta="13 hits this book · 274 books" prov="default" />
      </SearchGroup>

      <SearchGroup title="Always keep" count={1} tone="fuzzy">
        <SearchHit word="after-life" cat="always-keep" catTone="fuzzy"
          meta="0× this book · 89 books" prov="default" />
      </SearchGroup>

      <SearchGroup title="Pending from books" count={1} tone="gt">
        <SearchHit word="after-wards" cat="learned · always-join" catTone="gt"
          sub={<span>— from <span className="mono">belloc-survivals</span></span>}
          meta="awaiting promotion · 4m ago" prov="learned" />
      </SearchGroup>

      <SearchGroup title="Imported sets" count={2} tone="ocr">
        <SearchHit word="after-thought" cat="gutenberg-classics.json" catTone="ocr"
          meta="always-join · imported Apr 4" prov="imported" />
        <SearchHit word="after-glow" cat="19c-english.json" catTone="ocr"
          meta="always-keep · imported Mar 2" prov="imported" />
      </SearchGroup>

      {/* Create-from-query CTA */}
      <div style={{
        padding: '12px 16px',
        background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
        borderTop: '1px solid color-mix(in srgb, var(--accent) 30%, var(--border-1))',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Icon name="plus" size={14} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>
          Create a new rule from <span className="mono" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>"after"</span> →
        </span>
        <Button variant="outline" size="sm">+ beginning</Button>
        <Button variant="outline" size="sm">+ always-join</Button>
        <Button variant="outline" size="sm">+ scanno</Button>
        <div style={{ flex: 1 }} />
        <Kbd>⌘N</Kbd>
      </div>
    </div>
  </LibraryShell>
);

/* ====================================================================
   L6 · Bulk editor — Paste-list + JSON view with diff preview
==================================================================== */

const JsonLine = ({ ind = 0, children, tone, mark }) => {
  const bg = mark === 'add' ? 'color-mix(in srgb, var(--exact) 10%, transparent)'
           : mark === 'del' ? 'color-mix(in srgb, var(--mismatch) 10%, transparent)'
           : 'transparent';
  const lc = mark === 'add' ? 'var(--exact)' : mark === 'del' ? 'var(--mismatch)' : 'var(--ink-4)';
  const gutter = mark === 'add' ? '+' : mark === 'del' ? '−' : ' ';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '14px 1fr',
      background: bg, fontFamily: 'var(--mono-font)', fontSize: 11.5, lineHeight: 1.65,
    }}>
      <span style={{ color: lc, textAlign: 'center', userSelect: 'none' }}>{gutter}</span>
      <span style={{ color: tone || 'var(--ink-2)', paddingLeft: ind * 14, whiteSpace: 'pre' }}>{children}</span>
    </div>
  );
};

const Tk = ({ k, v, last }) => (
  <>
    <span style={{ color: 'var(--ocr)' }}>"{k}"</span>
    <span style={{ color: 'var(--ink-4)' }}>: </span>
    <span style={{ color: 'var(--exact)' }}>"{v}"</span>
    {!last ? <span style={{ color: 'var(--ink-4)' }}>,</span> : null}
  </>
);

const LibL6 = ({ theme }) => (
  <LibraryShell
    theme={theme}
    activeId="always-join"
    breadcrumb="Hyphen rules · Always join · Bulk edit"
    title="Bulk edit"
    actions={
      <>
        <Button variant="ghost" size="sm" icon="x">Cancel</Button>
        <Button variant="primary" size="sm" icon="check">Apply · +12, −2, ~1</Button>
      </>
    }
  >
    {/* Mode toggle */}
    <div style={{
      padding: '14px 28px 0',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        display: 'inline-flex', padding: 3, gap: 2,
        background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
        borderRadius: 7,
      }}>
        {[
          { id: 'visual', label: 'Visual', icon: 'grip' },
          { id: 'paste',  label: 'Paste list', icon: 'fileText', on: true },
          { id: 'json',   label: 'JSON', icon: 'file' },
        ].map(o => (
          <span key={o.id} style={{
            padding: '4px 10px', borderRadius: 5,
            background: o.on ? 'var(--bg-surface)' : 'transparent',
            boxShadow: o.on ? '0 0 0 1px var(--border-2)' : 'none',
            color: o.on ? 'var(--ink-1)' : 'var(--ink-3)',
            fontSize: 11.5, fontWeight: o.on ? 600 : 500,
            display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          }}>
            <Icon name={o.icon} size={12} /> {o.label}
          </span>
        ))}
      </div>
      <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
        Editing <span className="mono" style={{ color: 'var(--ink-1)' }}>always-join</span> · 17 existing rules
      </span>
    </div>

    {/* Two-pane editor */}
    <div style={{
      flex: 1, minHeight: 0,
      padding: '14px 28px 28px',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 16,
    }}>
      {/* LEFT: paste input */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
        borderRadius: 9, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-1)' }}>Paste list</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
              One <span className="mono">head-tail</span> word per line. Lines starting with <span className="mono">#</span> are comments.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button variant="ghost" size="sm" icon="upload">From file</Button>
          </div>
        </div>
        <div style={{
          flex: 1, padding: '12px 14px',
          fontFamily: 'var(--mono-font)', fontSize: 12, lineHeight: 1.6,
          color: 'var(--ink-1)', background: 'var(--bg-sunk)',
          whiteSpace: 'pre', overflow: 'auto',
        }}>
{`# from belloc-survivals hyphen report
common-wealth
fore-shadowed
cuck-field
after-wards

# user requests · slack #ocr-prep
any-time
work-shop
mid-night
sunder-land
out-side
under-stand
in-side

# remove these two:
# my-self   (incorrect — already covered by him-self)
# her-self

over-look
horse-shoe
fire-place
out-going
under-go
upon
`}
        </div>
        <div style={{
          padding: '8px 14px', borderTop: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 11, color: 'var(--ink-3)',
          background: 'var(--bg-page)',
        }}>
          <Icon name="info" size={11} />
          <span>20 lines · 17 valid · 1 duplicate of existing · 2 comments</span>
        </div>
      </div>

      {/* RIGHT: diff preview */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
        borderRadius: 9, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-1)' }}>Diff preview</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2, display: 'flex', gap: 12 }}>
              <span style={{ color: 'var(--exact)' }}>+12 added</span>
              <span style={{ color: 'var(--mismatch)' }}>−2 removed</span>
              <span style={{ color: 'var(--fuzzy)' }}>~1 conflict</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{
              display: 'inline-flex', padding: 2, gap: 2,
              background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
              borderRadius: 5,
            }}>
              <span style={{
                padding: '3px 8px', borderRadius: 3, fontSize: 10.5,
                background: 'var(--bg-surface)', color: 'var(--ink-1)', fontWeight: 600,
                boxShadow: '0 0 0 1px var(--border-2)',
              }}>JSON</span>
              <span style={{ padding: '3px 8px', fontSize: 10.5, color: 'var(--ink-3)' }}>Table</span>
            </span>
          </div>
        </div>
        <div style={{
          flex: 1, padding: '10px 4px 14px', background: 'var(--bg-sunk)',
          overflow: 'auto',
        }}>
          <JsonLine>{`{`}</JsonLine>
          <JsonLine ind={1}><span style={{ color: 'var(--ocr)' }}>"alwaysJoin"</span><span style={{ color: 'var(--ink-4)' }}>: [</span></JsonLine>

          {/* Adds (from learned) */}
          <JsonLine ind={2} mark="add"><Tk k="word" v="common-wealth" /> <span style={{ color: 'var(--ink-4)' }}>// from belloc-survivals</span></JsonLine>
          <JsonLine ind={2} mark="add"><Tk k="word" v="fore-shadowed" /></JsonLine>
          <JsonLine ind={2} mark="add"><Tk k="word" v="cuck-field" /></JsonLine>
          <JsonLine ind={2} mark="add"><Tk k="word" v="after-wards" /></JsonLine>

          <JsonLine ind={2} mark="add"><Tk k="word" v="any-time" /> <span style={{ color: 'var(--ink-4)' }}>// user requests</span></JsonLine>
          <JsonLine ind={2} mark="add"><Tk k="word" v="work-shop" /></JsonLine>
          <JsonLine ind={2} mark="add"><Tk k="word" v="mid-night" /></JsonLine>
          <JsonLine ind={2} mark="add"><Tk k="word" v="sunder-land" /></JsonLine>
          <JsonLine ind={2} mark="add"><Tk k="word" v="out-side" /></JsonLine>
          <JsonLine ind={2} mark="add"><Tk k="word" v="under-stand" /></JsonLine>
          <JsonLine ind={2} mark="add"><Tk k="word" v="in-side" /></JsonLine>

          {/* Removes */}
          <JsonLine ind={2} mark="del"><Tk k="word" v="my-self" /> <span style={{ color: 'var(--ink-4)' }}>// duplicate of him-self pattern</span></JsonLine>
          <JsonLine ind={2} mark="del"><Tk k="word" v="her-self" /></JsonLine>

          {/* Conflict */}
          <JsonLine ind={2}><Tk k="word" v="after-noon" /></JsonLine>
          <JsonLine ind={2}><Tk k="word" v="any-thing" /></JsonLine>
          <JsonLine ind={2} mark="add"><Tk k="word" v="upon" />  <span style={{ color: 'var(--fuzzy)' }}>// ⚠ no hyphen — interpreted as syllable hint</span></JsonLine>
          <JsonLine ind={2}>...</JsonLine>
          <JsonLine ind={1}><span style={{ color: 'var(--ink-4)' }}>]</span></JsonLine>
          <JsonLine>{`}`}</JsonLine>

          {/* Conflict callout */}
          <div style={{
            margin: '10px 12px 0',
            padding: '8px 10px', borderRadius: 6,
            background: 'color-mix(in srgb, var(--fuzzy) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--fuzzy) 35%, transparent)',
            fontSize: 11, color: 'var(--ink-2)',
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <Icon name="alert" size={12} style={{ color: 'var(--fuzzy)', marginTop: 1 }} />
            <span>
              <span className="mono" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>upon</span>
              {' '}has no hyphen — needs the <span className="mono">head-tail</span> form
              (e.g. <span className="mono" style={{ color: 'var(--ink-1)' }}>up-on</span>). Click to fix.
            </span>
          </div>
        </div>
      </div>
    </div>
  </LibraryShell>
);

/* ====================================================================
   L7 · Empty state — starter packs
==================================================================== */

const PackChip = ({ children, scanno }) => (
  <span className="mono" style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 7px', borderRadius: 5,
    fontSize: 10.5, color: 'var(--ink-2)',
    background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
  }}>
    {scanno ? <Icon name="swap" size={10} style={{ color: 'var(--mismatch)' }} /> : null}
    {children}
  </span>
);

const StarterPack = ({ p, on }) => (
  <div style={{
    background: 'var(--bg-surface)',
    border: `1.5px solid ${on ? 'var(--accent)' : 'var(--border-1)'}`,
    borderRadius: 11, padding: '18px 18px 14px',
    display: 'flex', flexDirection: 'column', gap: 12,
    position: 'relative',
    boxShadow: on ? '0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent)' : 'none',
  }}>
    {p.rec ? (
      <span style={{
        position: 'absolute', top: -10, right: 14,
        padding: '2px 8px', borderRadius: 99,
        background: 'var(--accent)', color: 'var(--accent-ink)',
        fontFamily: 'var(--mono-font)', fontSize: 9.5, fontWeight: 700,
        letterSpacing: '.06em', textTransform: 'uppercase',
      }}>recommended</span>
    ) : null}

    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{p.title}</div>
      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 3 }}>{p.sub}</div>
    </div>

    {/* Count grid */}
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 0,
      background: 'var(--bg-sunk)', border: '1px solid var(--border-1)', borderRadius: 6,
      overflow: 'hidden',
    }}>
      {[
        { k: 'begin', label: 'begin', tone: 'block' },
        { k: 'end',   label: 'end',   tone: 'para' },
        { k: 'join',  label: 'join',  tone: 'exact' },
        { k: 'keep',  label: 'keep',  tone: 'fuzzy' },
        { k: 'scannos', label: 'scan', tone: 'mismatch' },
      ].map((c, i) => (
        <div key={c.k} style={{
          padding: '8px 6px', textAlign: 'center',
          borderRight: i < 4 ? '1px solid var(--border-1)' : 'none',
        }}>
          <div className="mono" style={{
            fontSize: 16, fontWeight: 700,
            color: `var(--${c.tone})`, lineHeight: 1,
          }}>{p.counts[c.k]}</div>
          <div style={{
            marginTop: 4, fontSize: 9, fontWeight: 700, letterSpacing: '.06em',
            textTransform: 'uppercase', color: 'var(--ink-4)',
          }}>{c.label}</div>
        </div>
      ))}
    </div>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {p.chips.map(c => <PackChip key={c} scanno={c.includes('→')}>{c}</PackChip>)}
    </div>

    <div style={{ fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.55, flex: 1 }}>
      {p.note}
    </div>

    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant={on ? 'primary' : 'outline'} size="sm" full icon={on ? 'check' : 'download'}>
        {on ? 'Selected · install' : 'Install pack'}
      </Button>
      <Button variant="ghost" size="sm">Preview</Button>
    </div>
  </div>
);

const LibL7 = ({ theme }) => (
  <div className="pgd" data-theme={theme} style={{
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', background: 'var(--bg-page)',
  }}>
    <TopNav />
    <main style={{ flex: 1, overflow: 'auto' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 32px 64px' }}>
        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
            display: 'grid', placeItems: 'center', color: 'var(--accent)',
            marginBottom: 4,
          }}>
            <Icon name="sparkles" size={24} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink-1)' }}>
            Your library is empty
          </h1>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', maxWidth: 520, lineHeight: 1.55 }}>
            The library holds reusable rules that apply to every new project — hyphen joins, OCR scanno fixes,
            and custom dictionary entries. Install a starter pack to get going, or start with an empty library
            and add rules as you process books.
          </div>
        </div>

        {/* Step indicator */}
        <div style={{
          marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-4)',
        }}>
          <span style={{ width: 18, height: 18, borderRadius: 99, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center', fontFamily: 'var(--mono-font)', fontSize: 10, fontWeight: 700 }}>1</span>
          <span style={{ color: 'var(--ink-1)' }}>Choose a starter</span>
          <span style={{ width: 30, height: 1, background: 'var(--border-2)' }} />
          <span style={{ width: 18, height: 18, borderRadius: 99, background: 'var(--bg-raised)', border: '1px solid var(--border-2)', color: 'var(--ink-3)', display: 'grid', placeItems: 'center', fontFamily: 'var(--mono-font)', fontSize: 10, fontWeight: 700 }}>2</span>
          <span>Review &amp; customise</span>
          <span style={{ width: 30, height: 1, background: 'var(--border-2)' }} />
          <span style={{ width: 18, height: 18, borderRadius: 99, background: 'var(--bg-raised)', border: '1px solid var(--border-2)', color: 'var(--ink-3)', display: 'grid', placeItems: 'center', fontFamily: 'var(--mono-font)', fontSize: 10, fontWeight: 700 }}>3</span>
          <span>Apply</span>
        </div>

        {/* Pack grid */}
        <div style={{
          marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
        }}>
          {STARTER_PACKS.map((p, i) => (
            <StarterPack key={p.id} p={p} on={i === 0} />
          ))}
        </div>

        {/* Mix-and-match summary */}
        <div style={{
          marginTop: 18, padding: '12px 16px',
          background: 'var(--bg-surface)', border: '1px solid var(--border-1)', borderRadius: 9,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <Icon name="checkCircle" size={16} style={{ color: 'var(--exact)' }} />
          <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-2)' }}>
            <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>1 pack selected</span>
            <span style={{ color: 'var(--ink-3)' }}> · Project Gutenberg defaults will install 71 rules. You can install more packs after — they merge intelligently.</span>
          </div>
          <Button variant="primary" size="md" icon="arrowR" iconRight="arrowR">Continue</Button>
        </div>

        {/* Alternatives */}
        <div style={{
          marginTop: 28,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14,
        }}>
          {[
            { icon: 'upload', title: 'Import a JSON file', sub: 'Bring in a previously-exported library.', cta: 'Choose file…' },
            { icon: 'link',   title: 'Import from URL',    sub: 'Paste a link to a shared rules JSON.',    cta: 'Paste URL' },
            { icon: 'x',      title: 'Start with empty',   sub: 'Add rules as you process each book.',    cta: 'Skip & continue' },
          ].map(o => (
            <div key={o.title} style={{
              padding: '14px 16px',
              background: 'var(--bg-surface)', border: '1px dashed var(--border-2)', borderRadius: 9,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name={o.icon} size={14} style={{ color: 'var(--ink-3)' }} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-1)' }}>{o.title}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>{o.sub}</div>
              <div style={{ marginTop: 6 }}>
                <Button variant="ghost" size="sm">{o.cta}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

/* ====================================================================
   Dialog primitives — modal that overlays a frozen background frame
==================================================================== */

const ModalOverlay = ({ children, behind }) => (
  <div className="pgd" style={{
    width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
  }}>
    {behind}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32,
    }}>
      {children}
    </div>
  </div>
);

const DialogShell = ({ title, sub, icon, footer, children, width = 1080, height }) => (
  <div style={{
    width, maxWidth: '100%',
    height, maxHeight: '100%',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-2)',
    borderRadius: 12,
    boxShadow: 'var(--shadow-floating), 0 30px 60px rgba(0,0,0,0.45)',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  }}>
    {/* Title bar */}
    <div style={{
      padding: '16px 22px',
      borderBottom: '1px solid var(--border-1)',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 7,
        background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
        border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
        display: 'grid', placeItems: 'center', color: 'var(--accent)',
      }}>
        <Icon name={icon} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink-1)' }}>{title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>
      </div>
      <Button variant="ghost" size="sm">
        <Icon name="x" size={13} />
      </Button>
    </div>

    {/* Body */}
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>

    {/* Footer */}
    {footer}
  </div>
);

/* ====================================================================
   L8 · Import dialog — file / paste / URL / starter packs · with diff
==================================================================== */

const SOURCE_TABS = [
  { id: 'file',    icon: 'upload', label: 'From file',    sub: '.json or .csv' },
  { id: 'paste',   icon: 'fileText', label: 'Paste JSON',   sub: 'or one-per-line' },
  { id: 'url',     icon: 'link',   label: 'From URL',     sub: 'public catalog' },
  { id: 'starter', icon: 'sparkles', label: 'Starter packs', sub: '3 curated' },
];

const ImportSourceTab = ({ t, on }) => (
  <div style={{
    padding: '12px 14px',
    background: on ? 'var(--bg-surface)' : 'transparent',
    borderBottom: on ? '2px solid var(--accent)' : '2px solid transparent',
    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
    color: on ? 'var(--ink-1)' : 'var(--ink-3)',
  }}>
    <Icon name={t.icon} size={14} />
    <div>
      <div style={{ fontSize: 12, fontWeight: on ? 600 : 500 }}>{t.label}</div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 1 }}>{t.sub}</div>
    </div>
  </div>
);

const FilePicker = () => (
  <div style={{ padding: '18px 22px' }}>
    {/* Drop zone with file already chosen */}
    <div style={{
      padding: '18px 18px',
      background: 'color-mix(in srgb, var(--accent) 5%, var(--bg-sunk))',
      border: '1.5px dashed color-mix(in srgb, var(--accent) 45%, transparent)',
      borderRadius: 9,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 40, height: 48, borderRadius: 5,
        background: 'var(--bg-surface)', border: '1px solid var(--border-2)',
        display: 'grid', placeItems: 'center', color: 'var(--accent)',
        position: 'relative',
      }}>
        <Icon name="fileText" size={18} />
        <span className="mono" style={{
          position: 'absolute', bottom: 3, fontSize: 8, fontWeight: 700,
          color: 'var(--accent)', letterSpacing: '.04em',
        }}>JSON</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mono" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-1)' }}>
          gutenberg-classics.v2.json
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>
          18.4 kB · 71 rules · validated 1s ago
        </div>
      </div>
      <Button variant="ghost" size="sm" icon="refresh">Replace</Button>
      <Button variant="ghost" size="sm">
        <Icon name="x" size={12} />
      </Button>
    </div>

    {/* Apply mode */}
    <div style={{ marginTop: 16 }}>
      <div style={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
        textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 8,
      }}>How to apply</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { id: 'merge', label: 'Merge with existing', sub: 'Add new, keep yours. Conflicts flagged.', on: true },
          { id: 'replace', label: 'Replace library', sub: 'Wipe everything and start fresh. Backup first.', on: false },
        ].map(m => (
          <div key={m.id} style={{
            padding: '10px 12px',
            background: m.on ? 'color-mix(in srgb, var(--accent) 6%, var(--bg-surface))' : 'var(--bg-surface)',
            border: `1.5px solid ${m.on ? 'var(--accent)' : 'var(--border-1)'}`,
            borderRadius: 7,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            cursor: 'pointer',
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: 99, marginTop: 2,
              border: `1.5px solid ${m.on ? 'var(--accent)' : 'var(--border-2)'}`,
              background: m.on ? 'radial-gradient(var(--accent) 35%, transparent 40%)' : 'transparent',
            }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: m.on ? 'var(--ink-1)' : 'var(--ink-2)' }}>{m.label}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.45 }}>{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <label style={{
        marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 11.5, color: 'var(--ink-2)', cursor: 'pointer',
      }}>
        <span style={{
          width: 14, height: 14, borderRadius: 3,
          background: 'var(--accent)', border: '1px solid var(--accent)',
          display: 'grid', placeItems: 'center', color: 'var(--accent-ink)',
        }}>
          <Icon name="check" size={9} stroke={3} />
        </span>
        Tag imported rules with provenance <ProvPip kind="imported" source="gutenberg-classics.v2" dense />
      </label>
    </div>
  </div>
);

const ImportDiffSummary = () => (
  <div style={{
    padding: '14px 18px',
    borderTop: '1px solid var(--border-1)',
    background: 'var(--bg-page)',
    display: 'flex', flexDirection: 'column', gap: 10,
  }}>
    <div style={{
      fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
      textTransform: 'uppercase', color: 'var(--ink-4)',
    }}>Diff preview · what will change</div>
    {/* Per-category bars */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[
        { cat: 'Beginnings',  tone: 'block',    add: 14, del: 0, conflict: 0, total: 20 },
        { cat: 'Endings',     tone: 'para',     add: 5,  del: 0, conflict: 0, total: 10 },
        { cat: 'Always join', tone: 'exact',    add: 18, del: 0, conflict: 3, total: 17 },
        { cat: 'Always keep', tone: 'fuzzy',    add: 23, del: 0, conflict: 1, total: 13 },
        { cat: 'OCR scannos', tone: 'mismatch', add: 11, del: 0, conflict: 0, total: 11 },
      ].map(r => (
        <div key={r.cat} style={{
          display: 'grid', gridTemplateColumns: '150px 1fr 70px 70px 90px',
          gap: 10, alignItems: 'center',
          fontSize: 11.5,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--ink-2)',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: `var(--${r.tone})` }} />
            {r.cat}
          </span>
          {/* tiny inline bar showing existing vs adds */}
          <div style={{
            height: 6, background: 'var(--bg-raised)', borderRadius: 99, overflow: 'hidden',
            display: 'flex',
          }}>
            <div style={{ width: `${(r.total / (r.total + r.add)) * 100}%`, background: 'var(--ink-3)' }} />
            <div style={{ width: `${(r.add / (r.total + r.add)) * 100}%`, background: 'var(--exact)' }} />
          </div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--exact)', fontWeight: 600 }}>+{r.add}</span>
          <span className="mono" style={{ fontSize: 11, color: r.conflict ? 'var(--fuzzy)' : 'var(--ink-4)', fontWeight: 600 }}>
            {r.conflict ? `${r.conflict} conf.` : '·'}
          </span>
          <Button variant="ghost" size="sm">View</Button>
        </div>
      ))}
    </div>

    {/* Conflict callout */}
    <div style={{
      marginTop: 4, padding: '8px 12px', borderRadius: 6,
      background: 'color-mix(in srgb, var(--fuzzy) 10%, transparent)',
      border: '1px solid color-mix(in srgb, var(--fuzzy) 30%, transparent)',
      display: 'flex', alignItems: 'flex-start', gap: 8,
      fontSize: 11.5, color: 'var(--ink-2)',
    }}>
      <Icon name="alert" size={12} style={{ color: 'var(--fuzzy)', marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>4 conflicts</span>
        <span style={{ color: 'var(--ink-3)' }}> — rules that exist in your library with a different decision.</span>
        <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span className="mono" style={{
            padding: '1px 6px', borderRadius: 3, fontSize: 10.5, color: 'var(--ink-1)',
            background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
          }}>to-day <span style={{ color: 'var(--ink-4)' }}>(yours: join · import: keep)</span></span>
          <span className="mono" style={{
            padding: '1px 6px', borderRadius: 3, fontSize: 10.5, color: 'var(--ink-1)',
            background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
          }}>co-operate</span>
          <span className="mono" style={{
            padding: '1px 6px', borderRadius: 3, fontSize: 10.5, color: 'var(--ink-1)',
            background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
          }}>any-thing</span>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>+1 more</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignSelf: 'center' }}>
        <Button variant="ghost" size="sm">Keep mine</Button>
        <Button variant="ghost" size="sm">Use import</Button>
        <Button variant="outline" size="sm">Decide each…</Button>
      </div>
    </div>
  </div>
);

const LibL8 = ({ theme }) => (
  <ModalOverlay behind={<LibL3 theme={theme} />}>
    <DialogShell
      title="Import library"
      sub="Bring in rules from a file, paste, URL, or pick a starter pack."
      icon="upload"
      width={1100}
      height={760}
      footer={
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
            <span className="mono" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>71 → 142 rules</span>
            <span style={{ color: 'var(--ink-4)' }}> after merge · backup will be saved to </span>
            <span className="mono" style={{ color: 'var(--ink-2)' }}>library-pre-import-2026-05-21.json</span>
          </span>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" size="md">Cancel</Button>
          <Button variant="outline" size="md" icon="download">Download backup</Button>
          <Button variant="primary" size="md" icon="check">Apply · +71, ~4 conflicts</Button>
        </div>
      }
    >
      {/* Source tabs */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        background: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-1)',
      }}>
        {SOURCE_TABS.map(t => (
          <ImportSourceTab key={t.id} t={t} on={t.id === 'file'} />
        ))}
      </div>

      {/* Two-pane body: source picker + diff */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
      }}>
        <div style={{ borderRight: '1px solid var(--border-1)', overflow: 'auto' }}>
          <FilePicker />
        </div>
        <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Quick stats */}
          <div style={{
            padding: '18px 22px',
            display: 'flex', gap: 10,
            borderBottom: '1px solid var(--border-1)',
          }}>
            {[
              { v: '71',  l: 'Rules to add',      tone: 'exact' },
              { v: '4',   l: 'Conflicts',         tone: 'fuzzy' },
              { v: '0',   l: 'Will remove',       tone: 'mismatch' },
              { v: '142', l: 'Total after merge', tone: 'ink-2' },
            ].map(s => (
              <div key={s.l} style={{
                flex: 1, padding: '10px 12px',
                background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
                borderRadius: 6,
              }}>
                <div className="mono" style={{
                  fontSize: 18, fontWeight: 700, lineHeight: 1,
                  color: s.tone.startsWith('--') ? `var(${s.tone})` : `var(--${s.tone})`,
                }}>{s.v}</div>
                <div style={{
                  marginTop: 4, fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em',
                  textTransform: 'uppercase', color: 'var(--ink-4)',
                }}>{s.l}</div>
              </div>
            ))}
          </div>
          <ImportDiffSummary />
        </div>
      </div>
    </DialogShell>
  </ModalOverlay>
);

/* ====================================================================
   L9 · Export dialog — scope + format + preview
==================================================================== */

const CheckRow = ({ label, sub, count, tone, on, indent }) => (
  <label style={{
    display: 'grid',
    gridTemplateColumns: '20px 1fr 60px',
    gap: 10, alignItems: 'center',
    padding: '7px 12px',
    paddingLeft: 12 + (indent || 0) * 16,
    borderRadius: 6,
    cursor: 'pointer',
    background: on ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'transparent',
  }}>
    <span style={{
      width: 14, height: 14, borderRadius: 3,
      background: on ? 'var(--accent)' : 'var(--bg-raised)',
      border: `1px solid ${on ? 'var(--accent)' : 'var(--border-2)'}`,
      display: 'grid', placeItems: 'center', color: 'var(--accent-ink)',
    }}>
      {on ? <Icon name="check" size={9} stroke={3} /> : null}
    </span>
    <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
      {tone ? <span style={{ width: 6, height: 6, borderRadius: 99, background: `var(--${tone})` }} /> : null}
      <span style={{ fontSize: 12, color: 'var(--ink-1)', fontWeight: indent ? 500 : 600 }}>{label}</span>
      {sub ? <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{sub}</span> : null}
    </div>
    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'right' }}>{count}</span>
  </label>
);

const RadioRow = ({ label, sub, on }) => (
  <label style={{
    display: 'flex', alignItems: 'flex-start', gap: 10,
    padding: '8px 12px', borderRadius: 6,
    background: on ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'transparent',
    cursor: 'pointer',
  }}>
    <span style={{
      width: 14, height: 14, borderRadius: 99, marginTop: 2,
      border: `1.5px solid ${on ? 'var(--accent)' : 'var(--border-2)'}`,
      background: on ? 'radial-gradient(var(--accent) 35%, transparent 40%)' : 'transparent',
    }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: on ? 'var(--ink-1)' : 'var(--ink-2)' }}>{label}</div>
      {sub ? <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.5 }}>{sub}</div> : null}
    </div>
  </label>
);

const SegTab = ({ label, on }) => (
  <span style={{
    padding: '4px 12px', borderRadius: 5,
    background: on ? 'var(--bg-surface)' : 'transparent',
    boxShadow: on ? '0 0 0 1px var(--border-2)' : 'none',
    color: on ? 'var(--ink-1)' : 'var(--ink-3)',
    fontSize: 11.5, fontWeight: on ? 600 : 500,
    cursor: 'pointer',
  }}>{label}</span>
);

const LibL9 = ({ theme }) => (
  <ModalOverlay behind={<LibL3 theme={theme} />}>
    <DialogShell
      title="Export library"
      sub="Choose what to include, then download or copy to clipboard."
      icon="download"
      width={1100}
      height={760}
      footer={
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="checkCircle" size={14} style={{ color: 'var(--exact)' }} />
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
            <span className="mono" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>54 rules</span>
            <span style={{ color: 'var(--ink-4)' }}> · </span>
            <span className="mono" style={{ color: 'var(--ink-1)' }}>3.2 kB</span>
            <span style={{ color: 'var(--ink-4)' }}> · ready as </span>
            <span className="mono" style={{ color: 'var(--ink-2)' }}>belloc-library-2026-05-21.json</span>
          </span>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" size="md">Cancel</Button>
          <Button variant="outline" size="md" icon="copy">Copy JSON</Button>
          <Button variant="outline" size="md" icon="link">Share link</Button>
          <Button variant="primary" size="md" icon="download">Download</Button>
        </div>
      }
    >
      {/* Two-pane body */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid', gridTemplateColumns: '420px 1fr',
      }}>
        {/* LEFT: scope + format */}
        <div style={{
          borderRight: '1px solid var(--border-1)',
          overflow: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          {/* Categories */}
          <div style={{ padding: '16px 18px 4px' }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span>Categories</span>
              <span style={{
                fontSize: 10, fontWeight: 500, color: 'var(--accent)',
                cursor: 'pointer', letterSpacing: 0, textTransform: 'none',
              }}>Select all · Clear</span>
            </div>
            <CheckRow label="Hyphen rules"     count="60" on />
            <CheckRow label="Beginnings"       count="20" tone="block"    on indent={1} />
            <CheckRow label="Endings"          count="10" tone="para"     on indent={1} />
            <CheckRow label="Always join"      count="17" tone="exact"    on indent={1} />
            <CheckRow label="Always keep"      count="13" tone="fuzzy"    on indent={1} />
            <CheckRow label="OCR scannos"      count="11" tone="mismatch" on />
            <CheckRow label="Custom dictionary" sub="excluded by default" count="84" />
          </div>

          {/* Provenance filter */}
          <div style={{ padding: '14px 18px 4px' }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 6,
            }}>Provenance filter</div>
            <CheckRow label="Default rules"     sub="built-in" count="42" on />
            <CheckRow label="My additions"      sub="user"     count="1"  on />
            <CheckRow label="Imported sets"     sub="json"     count="8"  on />
            <CheckRow label="Learned from books" sub="3 books" count="3"  on />
          </div>

          {/* Format */}
          <div style={{ padding: '14px 18px 4px' }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 8,
            }}>Format</div>
            <RadioRow
              label="JSON · single file"
              sub="Round-trips with Import. Preserves provenance + metadata."
              on
            />
            <RadioRow
              label="JSON · split per category"
              sub="Five files in a zip. For diff-friendly Git tracking."
            />
            <RadioRow
              label="CSV · scannos only"
              sub="find,replace,ignoreCase columns. For spreadsheet edits."
            />
            <RadioRow
              label="Plain text · one per line"
              sub="Just the words. Lossy — drops provenance."
            />
          </div>

          {/* Filename */}
          <div style={{ padding: '14px 18px 22px' }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 6,
            }}>Filename</div>
            <Input value="belloc-library-2026-05-21" mono suffix=".json" />
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 14, height: 14, borderRadius: 3,
                background: 'var(--accent)', border: '1px solid var(--accent)',
                display: 'grid', placeItems: 'center', color: 'var(--accent-ink)',
              }}>
                <Icon name="check" size={9} stroke={3} />
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>Include README explaining the schema</span>
            </div>
          </div>
        </div>

        {/* RIGHT: live preview */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{
            padding: '12px 18px', borderBottom: '1px solid var(--border-1)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: 'var(--ink-4)',
            }}>Preview</span>
            <div style={{
              display: 'inline-flex', padding: 2, gap: 2,
              background: 'var(--bg-raised)', border: '1px solid var(--border-1)',
              borderRadius: 5,
            }}>
              <SegTab label="JSON" on />
              <SegTab label="Table" />
              <SegTab label="Diff vs last export" />
            </div>
            <div style={{ flex: 1 }} />
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>
              showing 54 of 54 entries
            </span>
          </div>

          <div style={{
            flex: 1, padding: '12px 6px', background: 'var(--bg-sunk)',
            overflow: 'auto',
          }}>
            <JsonLine>{`{`}</JsonLine>
            <JsonLine ind={1}><span style={{ color: 'var(--ocr)' }}>"$schema"</span><span style={{ color: 'var(--ink-4)' }}>: </span><span style={{ color: 'var(--exact)' }}>"pgdp-library@v2"</span><span style={{ color: 'var(--ink-4)' }}>,</span></JsonLine>
            <JsonLine ind={1}><span style={{ color: 'var(--ocr)' }}>"exportedAt"</span><span style={{ color: 'var(--ink-4)' }}>: </span><span style={{ color: 'var(--exact)' }}>"2026-05-21T14:32:00Z"</span><span style={{ color: 'var(--ink-4)' }}>,</span></JsonLine>
            <JsonLine ind={1}><span style={{ color: 'var(--ocr)' }}>"exportedBy"</span><span style={{ color: 'var(--ink-4)' }}>: </span><span style={{ color: 'var(--exact)' }}>"jsmith"</span><span style={{ color: 'var(--ink-4)' }}>,</span></JsonLine>
            <JsonLine ind={1}><span style={{ color: 'var(--ocr)' }}>"counts"</span><span style={{ color: 'var(--ink-4)' }}>{`: { begin: 20, end: 10, join: 17, keep: 13, scannos: 11 },`}</span></JsonLine>
            <JsonLine ind={1}><span style={{ color: 'var(--ocr)' }}>"alwaysJoin"</span><span style={{ color: 'var(--ink-4)' }}>: [</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`{ `}</span><Tk k="word" v="after-noon" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="prov" v="default" last /><span style={{ color: 'var(--ink-4)' }}>{` },`}</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`{ `}</span><Tk k="word" v="any-thing" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="prov" v="default" last /><span style={{ color: 'var(--ink-4)' }}>{` },`}</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`{ `}</span><Tk k="word" v="with-out" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="prov" v="default" last /><span style={{ color: 'var(--ink-4)' }}>{` },`}</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`// ... 9 more default ...`}</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`{ `}</span><Tk k="word" v="after-wards" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="prov" v="user" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="addedBy" v="jsmith" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="addedAt" v="2026-04-12" last /><span style={{ color: 'var(--ink-4)' }}>{` },`}</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`{ `}</span><Tk k="word" v="common-wealth" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="prov" v="learned" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="fromBook" v="belloc-survivals" last /><span style={{ color: 'var(--ink-4)' }}>{` },`}</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`{ `}</span><Tk k="word" v="fore-shadowed" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="prov" v="learned" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="fromBook" v="belloc-survivals" last /><span style={{ color: 'var(--ink-4)' }}>{` },`}</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`{ `}</span><Tk k="word" v="cuck-field" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="prov" v="learned" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="fromBook" v="belloc-survivals" last /><span style={{ color: 'var(--ink-4)' }}>{` }`}</span></JsonLine>
            <JsonLine ind={1}><span style={{ color: 'var(--ink-4)' }}>],</span></JsonLine>
            <JsonLine ind={1}><span style={{ color: 'var(--ocr)' }}>"scannos"</span><span style={{ color: 'var(--ink-4)' }}>: [</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`{ `}</span><Tk k="find" v="tlie" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="replace" v="the" last /><span style={{ color: 'var(--ink-4)' }}>{` },`}</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`{ `}</span><Tk k="find" v="arid" /><span style={{ color: 'var(--ink-4)' }}>, </span><Tk k="replace" v="and" last /><span style={{ color: 'var(--ink-4)' }}>{` },`}</span></JsonLine>
            <JsonLine ind={2}><span style={{ color: 'var(--ink-4)' }}>{`// ... 9 more ...`}</span></JsonLine>
            <JsonLine ind={1}><span style={{ color: 'var(--ink-4)' }}>]</span></JsonLine>
            <JsonLine>{`}`}</JsonLine>
          </div>
        </div>
      </div>
    </DialogShell>
  </ModalOverlay>
);

/* ====================================================================
   Exports
==================================================================== */

Object.assign(window, {
  LibL3, LibL4, LibL5, LibL6, LibL7, LibL8, LibL9,
});
