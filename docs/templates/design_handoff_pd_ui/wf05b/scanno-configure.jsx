// scanno-configure.jsx — C3: Global library, Scannos category.
// Reuses the WF-05a L3 shell shape — side-nav · list · provenance.
// Each rule has: pattern, optional suggestion, match type, scope, auto-apply,
// and an evidence trail showing which books contributed.

const { useState: useS5bC3 } = React;

const C3_RULES = [
  { id: 'r01', pattern: 'tlie',  sug: 'the',   match: 'literal', scope: 'global',
    auto: true,  hits: 4127, books: 89, contributors: ['bellocsurvivials', '+88 books'],
    added: 'Mar 2024', updated: 'May 18, 2026' },
  { id: 'r02', pattern: 'arn',   sug: 'arm',   match: 'word-final', scope: 'global',
    auto: false, hits: 612,  books: 41, conflict: 'Real surname "Arn"',
    contributors: ['weldon1924', '+40 books'],
    added: 'Aug 2024', updated: 'May 20, 2026' },
  { id: 'r03', pattern: 'abovc', sug: 'above', match: 'literal',    scope: 'global',
    auto: true,  hits: 901,  books: 73,
    contributors: ['bellocsurvivials', '+72 books'],
    added: 'Jan 2025', updated: 'May 12, 2026' },
  { id: 'r04', pattern: 'modcrn',sug: 'modern',match: 'literal',    scope: 'global',
    auto: false, hits: 318,  books: 22,
    contributors: ['bellocsurvivials', '+21 books'], isNew: true,
    added: 'May 12, 2026', updated: 'May 20, 2026' },
  { id: 'r05', pattern: '\\b\\w+0\\w+\\b', sug: null, match: 'regex', scope: 'global',
    auto: false, hits: 2840, books: 156,
    note: 'Digit-0 inside a word — almost always a misread "o".',
    contributors: ['system'],
    added: 'Apr 2024', updated: 'May 03, 2026' },
  { id: 'r06', pattern: 'rcad',  sug: 'read',  match: 'literal',    scope: 'global',
    auto: false, hits: 89,   books: 12,
    contributors: ['bellocsurvivials', '+11 books'],
    added: 'Oct 2024', updated: 'May 19, 2026' },
  { id: 'r07', pattern: '(.+)cm(.+)', sug: null, match: 'regex',    scope: 'global',
    auto: false, hits: 451,  books: 38,
    note: 'Possible c↔e misread in word-medial position. Highlight only.',
    contributors: ['system'],
    added: 'Feb 2025', updated: 'Apr 28, 2026' },
  { id: 'r08', pattern: 'fhe',   sug: 'the',   match: 'literal',    scope: 'project',
    auto: false, hits: 12,   books: 1,
    contributors: ['hilaire1903'],
    added: 'May 19, 2026', updated: 'May 19, 2026' },
];

const C3_MATCH_TONE = {
  literal: 'neutral',
  'word-final': 'fuzzy',
  regex: 'ocr',
};

function ScannoConfigure({ theme = 'dark' }) {
  const [selectedId, setSelectedId] = useS5bC3('r04');
  const selected = C3_RULES.find(r => r.id === selectedId);

  return (
    <div className="pgd" data-theme={theme} style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-page)', overflow: 'hidden',
    }}>
      <TopNav />

      {/* Library breadcrumb */}
      <div style={{
        flex: '0 0 auto', padding: '14px 24px 12px',
        borderBottom: '1px solid var(--border-1)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11.5, color: 'var(--ink-3)', fontFamily: 'var(--mono-font)' }}>
          <span>library</span>
          <Icon name="chevR" size={11} />
          <span style={{ color: 'var(--ink-2)' }}>scannos</span>
        </div>
        <span style={{ flex: 1 }} />
        <Input placeholder="Search rules…" suffix="⌘K" mono style={{ width: 280 }} />
        <Button size="md" variant="default" icon="download">Export</Button>
        <Button size="md" variant="default" icon="upload">Import</Button>
        <Button size="md" variant="primary" icon="plus">New rule</Button>
      </div>

      <div style={{ flex: 1, display: 'grid',
        gridTemplateColumns: '240px 1fr 400px', minHeight: 0 }}>

        {/* Side nav */}
        <div style={{
          borderRight: '1px solid var(--border-1)',
          background: 'var(--bg-surface)',
          padding: '20px 0', overflow: 'auto',
        }}>
          <NavGroup
            label="Hyphens"
            items={[
              { l: 'Hyphenated', n: 412 },
              { l: 'De-hyphenated', n: 178 },
              { l: 'Undecided', n: 24 },
              { l: 'Mismatched dashes', n: 8 },
            ]}
          />
          <NavGroup
            label="Scannos"
            items={[
              { l: 'All rules', n: 8, active: true },
              { l: 'Auto-apply on', n: 2, tone: 'exact' },
              { l: 'Highlight only', n: 6, tone: 'fuzzy' },
              { l: 'Pending review', n: 1, tone: 'fuzzy' },
              { l: 'Recently added', n: 3 },
            ]}
          />
          <NavGroup
            label="Dictionary"
            items={[
              { l: 'good_words', n: 1280 },
              { l: 'bad_words',  n: 96 },
              { l: 'Project-specific', n: 41 },
            ]}
          />
          <NavGroup
            label="Regex"
            items={[
              { l: 'Active', n: 12 },
              { l: 'Disabled', n: 4 },
            ]}
          />
          <div style={{ height: 1, margin: '12px 20px', background: 'var(--border-1)' }} />
          <NavGroup
            label="Promotion inbox"
            items={[
              { l: 'Awaiting review', n: 5, tone: 'fuzzy', badge: true },
              { l: 'Recently promoted', n: 12, tone: 'gt' },
            ]}
          />
        </div>

        {/* Rules list */}
        <div style={{ overflow: 'auto', borderRight: '1px solid var(--border-1)' }}>
          {/* Sticky toolbar */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 2,
            padding: '14px 24px', background: 'var(--bg-page)',
            borderBottom: '1px solid var(--border-1)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-1)',
              margin: 0, letterSpacing: '-0.005em' }}>Scannos · all rules</h2>
            <Badge mono>{C3_RULES.length}</Badge>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Sort:</span>
            <select style={{
              background: 'var(--bg-raised)', color: 'var(--ink-1)',
              border: '1px solid var(--border-2)', borderRadius: 5,
              fontSize: 11.5, padding: '4px 8px', fontFamily: 'var(--ui-font)',
              outline: 'none',
            }} defaultValue="hits">
              <option value="hits">Hits (descending)</option>
              <option value="recent">Recently updated</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>

          {/* List header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1.4fr 100px 100px 90px',
            gap: 12, padding: '8px 24px',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--ink-3)',
            background: 'var(--bg-sunk)',
            borderBottom: '1px solid var(--border-1)',
          }}>
            <span>Pattern → Suggestion</span>
            <span>Match · Scope</span>
            <span>Hits</span>
            <span>Books</span>
            <span>Auto</span>
          </div>

          {C3_RULES.map(r => {
            const active = r.id === selectedId;
            return (
              <div key={r.id}
                onClick={() => setSelectedId(r.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 1.4fr 100px 100px 90px',
                  gap: 12, padding: '14px 24px',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-1)',
                  background: active ? 'color-mix(in srgb, var(--accent) 6%, var(--bg-surface))' : 'transparent',
                  borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                  cursor: 'pointer',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span className="mono" style={{
                    fontSize: 13, fontWeight: 600, color: 'var(--ink-1)',
                    borderBottom: '2px solid var(--fuzzy)',
                    whiteSpace: 'nowrap',
                  }}>{r.pattern}</span>
                  {r.sug ? (
                    <>
                      <Icon name="arrowR" size={11} style={{ color: 'var(--ink-4)' }} />
                      <span className="mono" style={{ fontSize: 13, color: 'var(--exact)' }}>{r.sug}</span>
                    </>
                  ) : (
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)',
                      fontStyle: 'italic' }}>highlight only</span>
                  )}
                  {r.isNew ? <Badge tone="brand" mono>NEW</Badge> : null}
                  {r.conflict ? (
                    <Icon name="alert" size={12} style={{ color: 'var(--mismatch)' }} title={r.conflict} />
                  ) : null}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Badge tone={C3_MATCH_TONE[r.match]} mono>{r.match}</Badge>
                  <Badge mono>{r.scope}</Badge>
                </div>
                <span className="mono" style={{ fontSize: 12, color: 'var(--ink-1)' }}>{r.hits.toLocaleString()}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{r.books}</span>
                <span>
                  <ToggleBadge on={r.auto} />
                </span>
              </div>
            );
          })}
        </div>

        {/* Detail / provenance column */}
        <div style={{ overflow: 'auto', background: 'var(--bg-page)' }}>
          {selected ? <RuleDetail r={selected} /> : null}
        </div>
      </div>

      <ServerFooter />
    </div>
  );
}

function NavGroup({ label, items }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ padding: '4px 20px 6px', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
        {label}
      </div>
      {items.map(it => (
        <div key={it.l} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 20px', fontSize: 12.5,
          color: it.active ? 'var(--ink-1)' : 'var(--ink-2)',
          fontWeight: it.active ? 600 : 500,
          background: it.active ? 'var(--bg-raised)' : 'transparent',
          borderLeft: it.active ? '2px solid var(--accent)' : '2px solid transparent',
          cursor: 'pointer',
        }}>
          <span style={{ flex: 1 }}>{it.l}</span>
          {it.badge ? <Badge tone={it.tone || 'fuzzy'} mono>{it.n}</Badge> :
            it.n != null ? <span className="mono" style={{
              fontSize: 10.5,
              color: it.tone ? `var(--${it.tone})` : 'var(--ink-4)',
            }}>{it.n}</span> : null}
        </div>
      ))}
    </div>
  );
}

function ToggleBadge({ on }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 26, height: 14, borderRadius: 99,
        background: on ? 'var(--exact)' : 'var(--bg-sunk)',
        border: `1px solid ${on ? 'var(--exact)' : 'var(--border-3)'}`,
        position: 'relative',
      }}>
        <span style={{
          position: 'absolute', top: 1, left: on ? 12 : 1,
          width: 10, height: 10, borderRadius: 99,
          background: on ? 'var(--bg-page)' : 'var(--ink-3)',
          transition: 'left 100ms',
        }} />
      </span>
      <span style={{ fontSize: 10.5,
        color: on ? 'var(--exact)' : 'var(--ink-4)',
        fontFamily: 'var(--mono-font)',
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>{on ? 'on' : 'off'}</span>
    </span>
  );
}

function RuleDetail({ r }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24 }}>
      {/* Pattern header */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--ink-3)' }}>Rule</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center',
          gap: 10, flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 20, fontWeight: 600,
            color: 'var(--ink-1)', borderBottom: '2px solid var(--fuzzy)' }}>{r.pattern}</span>
          {r.sug ? (
            <>
              <Icon name="arrowR" size={16} style={{ color: 'var(--ink-3)' }} />
              <span className="mono" style={{ fontSize: 20, fontWeight: 500,
                color: 'var(--exact)' }}>{r.sug}</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Conflict warning */}
      {r.conflict ? (
        <div style={{
          padding: '10px 12px', borderRadius: 6,
          background: 'color-mix(in srgb, var(--mismatch) 8%, transparent)',
          border: '1px solid color-mix(in srgb, var(--mismatch) 30%, transparent)',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <Icon name="alert" size={14} style={{ color: 'var(--mismatch)', marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--mismatch)' }}>
              Conflict risk
            </div>
            <div style={{ marginTop: 3, fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              {r.conflict}. Auto-apply is off and should remain off unless restricted by scope.
            </div>
          </div>
        </div>
      ) : null}

      {/* Form */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
        borderRadius: 8, padding: 16,
      }}>
        <Row label="Match type">
          <div style={{ display: 'flex', gap: 6 }}>
            {['literal', 'word-final', 'word-initial', 'regex'].map(m => (
              <span key={m} style={{
                fontSize: 11, padding: '3px 8px', borderRadius: 4,
                background: r.match === m ? 'var(--bg-raised)' : 'transparent',
                border: `1px solid ${r.match === m ? 'var(--border-3)' : 'var(--border-1)'}`,
                color: r.match === m ? 'var(--ink-1)' : 'var(--ink-3)',
                fontFamily: 'var(--mono-font)', cursor: 'pointer',
              }}>{m}</span>
            ))}
          </div>
        </Row>
        <Row label="Scope">
          <div style={{ display: 'flex', gap: 6 }}>
            {['global', 'project', 'book'].map(s => (
              <span key={s} style={{
                fontSize: 11, padding: '3px 8px', borderRadius: 4,
                background: r.scope === s ? 'var(--bg-raised)' : 'transparent',
                border: `1px solid ${r.scope === s ? 'var(--border-3)' : 'var(--border-1)'}`,
                color: r.scope === s ? 'var(--ink-1)' : 'var(--ink-3)',
                fontFamily: 'var(--mono-font)', cursor: 'pointer',
              }}>{s}</span>
            ))}
          </div>
        </Row>
        <Row label="Auto-apply">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ToggleBadge on={r.auto} />
            <span style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.45 }}>
              {r.auto
                ? 'Each match is auto-replaced. Original token retained in change log.'
                : 'Each match is highlighted; proofers decide per-instance. Recommended default.'}
            </span>
          </div>
        </Row>
        {r.note ? (
          <Row label="Note">
            <span style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>{r.note}</span>
          </Row>
        ) : null}
      </div>

      {/* Evidence trail */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
          Evidence
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Stat n={r.hits.toLocaleString()} label="total hits" />
          <Stat n={r.books} label="books contributing" />
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-3)',
          lineHeight: 1.55 }}>
          Originated from <span style={{ color: 'var(--ink-2)' }} className="mono">{r.contributors[0]}</span>
          {r.contributors[1] ? <> · {r.contributors[1]}</> : null}
        </div>
        <div style={{ marginTop: 10, fontSize: 10.5, color: 'var(--ink-4)',
          fontFamily: 'var(--mono-font)' }}>
          added {r.added} · updated {r.updated}
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <Button size="md" variant="default" icon="wrench" full>Edit rule</Button>
        <Button size="md" variant="danger" icon="trash">Retire</Button>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr',
      gap: 12, alignItems: 'flex-start', padding: '8px 0',
      borderBottom: '1px solid var(--border-1)' }}>
      <span style={{ fontSize: 11, color: 'var(--ink-3)', paddingTop: 3 }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div style={{
      padding: 12, background: 'var(--bg-surface)',
      border: '1px solid var(--border-1)', borderRadius: 6,
    }}>
      <div className="mono" style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink-1)' }}>{n}</div>
      <div style={{ marginTop: 3, fontSize: 10.5, color: 'var(--ink-3)',
        letterSpacing: '0.03em' }}>{label}</div>
    </div>
  );
}

Object.assign(window, { ScannoConfigure });
