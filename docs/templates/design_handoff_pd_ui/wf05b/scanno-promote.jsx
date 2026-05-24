// scanno-promote.jsx — C2: per-book Scannos triage.
// Lives in Project Configure → Settings → Scannos. The bridge between
// book-local candidates (from rule matches, OCR-low-confidence, and manual marks)
// and the global library.

const { useState: useS5bC2 } = React;

const C2_CANDIDATES = [
  // source: rule | ocr | manual
  // status: pending | accepted-local | promoted | dismissed
  { id: 'c01', token: 'curi0us', sug: 'curious', src: 'ocr',    hits: 12, pages: '047, 048, 091…',
    conf: 0.42, status: 'pending',  firstSeen: 'p.047',
    note: 'OCR confidence 0.42 on 12 instances. Strong digit-for-letter pattern.' },
  { id: 'c02', token: 'abovc',   sug: 'above',   src: 'rule',   hits: 7,  pages: '044, 047, 112…',
    conf: 0.96, status: 'accepted-local', firstSeen: 'p.044',
    note: 'Matches global rule “c↔e word-final”. 7 hits. Auto-applied locally.' },
  { id: 'c03', token: 'cont',    sug: 'coat',    src: 'manual', hits: 4,  pages: '044, 047, 089, 201',
    conf: 0.71, status: 'pending',  firstSeen: 'p.044',
    note: 'Marked by user on p.044. No matching global rule.' },
  { id: 'c04', token: 'arn',     sug: 'arm',     src: 'rule',   hits: 6,  pages: '047, 049, 050…',
    conf: 0.88, status: 'pending',  firstSeen: 'p.047',
    note: 'Matches global rule “n↔m word-final”. Conflict risk: “arn” is a real surname.' },
  { id: 'c05', token: 'modcrn',  sug: 'modern',  src: 'rule',   hits: 9,  pages: '047, 088, 090…',
    conf: 0.64, status: 'promoted', firstSeen: 'p.047',
    note: 'Promoted to global library on May 12 → rule “c↔e medial”.' },
  { id: 'c06', token: 'rcad',    sug: 'read',    src: 'ocr',    hits: 3,  pages: '019, 117, 184',
    conf: 0.49, status: 'pending',  firstSeen: 'p.019',
    note: 'OCR confidence 0.49. Three discontiguous instances.' },
  { id: 'c07', token: 'tlie',    sug: 'the',     src: 'rule',   hits: 2,  pages: '208, 217',
    conf: 0.99, status: 'accepted-local', firstSeen: 'p.208',
    note: 'Matches global rule “tlie→the”. Auto-applied (rule opted into auto-apply).' },
  { id: 'c08', token: 'lic',     sug: 'he',      src: 'manual', hits: 1,  pages: '122',
    conf: 0.55, status: 'dismissed', firstSeen: 'p.122',
    note: 'User dismissed: “lic” intended as Latin abbreviation in the footnote.' },
];

const C2_STATUS_TONE = {
  'pending':         'fuzzy',
  'accepted-local':  'exact',
  'promoted':        'gt',
  'dismissed':       'neutral',
};
const C2_STATUS_LABEL = {
  'pending':        'Pending',
  'accepted-local': 'Book-local',
  'promoted':       'Promoted',
  'dismissed':      'Dismissed',
};
const C2_SRC_TONE = { ocr: 'ocr', manual: 'gt', rule: 'fuzzy' };
const C2_SRC_LABEL = { ocr: 'OCR low-conf', manual: 'Manual', rule: 'Rule match' };

function ScannoPromote({ theme = 'dark' }) {
  const [selectedId, setSelectedId] = useS5bC2('c01');
  const selected = C2_CANDIDATES.find(c => c.id === selectedId);

  return (
    <div className="pgd" data-theme={theme} style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-page)', overflow: 'hidden',
    }}>
      <TopNav />

      {/* Project Configure breadcrumb */}
      <div style={{
        flex: '0 0 auto', padding: '14px 24px 0',
        borderBottom: '1px solid var(--border-1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11.5, color: 'var(--ink-3)', fontFamily: 'var(--mono-font)' }}>
          <span>projects</span>
          <Icon name="chevR" size={11} />
          <span>bellocsurvivials</span>
          <Icon name="chevR" size={11} />
          <span style={{ color: 'var(--ink-2)' }}>configure</span>
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 0 }}>
          {[
            { l: 'Pages' },
            { l: 'Metadata' },
            { l: 'Settings', active: true },
            { l: 'Export' },
            { l: 'Activity' },
          ].map(tab => (
            <div key={tab.l} style={{
              padding: '8px 14px 9px', fontSize: 12,
              color: tab.active ? 'var(--ink-1)' : 'var(--ink-3)',
              fontWeight: tab.active ? 600 : 500,
              borderBottom: tab.active ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
            }}>{tab.l}</div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '220px 1fr',
        minHeight: 0 }}>
        {/* Settings sub-nav */}
        <div style={{
          borderRight: '1px solid var(--border-1)',
          background: 'var(--bg-surface)',
          padding: '20px 0',
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          <div style={{ padding: '0 20px 8px', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
            Per-book settings
          </div>
          {[
            { l: 'General' },
            { l: 'Hyphens', count: 18 },
            { l: 'Scannos', count: 8, active: true, badge: 5 },
            { l: 'Dictionary', count: 41 },
            { l: 'Page numbers' },
            { l: 'Illustrations' },
            { l: 'Notes' },
          ].map(item => (
            <div key={item.l} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 20px', fontSize: 12.5,
              color: item.active ? 'var(--ink-1)' : 'var(--ink-2)',
              fontWeight: item.active ? 600 : 500,
              background: item.active ? 'var(--bg-raised)' : 'transparent',
              borderLeft: item.active ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
            }}>
              <span style={{ flex: 1 }}>{item.l}</span>
              {item.badge ? <Badge tone="fuzzy" mono>{item.badge}</Badge> : null}
              {item.count != null && !item.badge
                ? <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{item.count}</span>
                : null}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-1)',
            fontSize: 11, color: 'var(--ink-3)' }}>
            Global library →
            <Button size="sm" variant="ghost" iconRight="arrowR" style={{ marginTop: 4, paddingLeft: 0 }}>
              Open library
            </Button>
          </div>
        </div>

        {/* Main panel */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0,
          overflow: 'hidden' }}>
          {/* Panel header */}
          <div style={{ padding: '20px 28px 14px', borderBottom: '1px solid var(--border-1)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-1)',
                  margin: 0, letterSpacing: '-0.005em' }}>Scannos · this book</h2>
                <p style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-3)',
                  maxWidth: 720, lineHeight: 1.5 }}>
                  Candidates suspected on pages in this book. Triage to dismiss noise,
                  accept locally (book-only), or promote to the global library so other
                  books benefit. Promotion records this book as evidence.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="md" variant="default" icon="download">Export</Button>
                <Button size="md" variant="primary" icon="plus">Add manually</Button>
              </div>
            </div>

            {/* Filter chips */}
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10,
              flexWrap: 'wrap' }}>
              {[
                { l: 'All',         n: 8, active: true },
                { l: 'Pending',     n: 4, tone: 'fuzzy' },
                { l: 'Book-local',  n: 2, tone: 'exact' },
                { l: 'Promoted',    n: 1, tone: 'gt' },
                { l: 'Dismissed',   n: 1, tone: 'neutral' },
              ].map(f => (
                <span key={f.l} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 99, fontSize: 11.5,
                  background: f.active ? 'var(--bg-raised)' : 'transparent',
                  color: f.active ? 'var(--ink-1)' : 'var(--ink-3)',
                  fontWeight: f.active ? 600 : 500,
                  border: `1px solid ${f.active ? 'var(--border-3)' : 'var(--border-1)'}`,
                  cursor: 'pointer',
                }}>
                  {f.l}
                  <span className="mono" style={{ opacity: 0.7, fontSize: 10.5 }}>{f.n}</span>
                </span>
              ))}
              <span style={{ width: 12, height: 16, borderLeft: '1px solid var(--border-1)' }} />
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Source:</span>
              {[
                { l: 'Rule',   tone: 'fuzzy' },
                { l: 'OCR',    tone: 'ocr' },
                { l: 'Manual', tone: 'gt' },
              ].map(s => (
                <Badge key={s.l} tone={s.tone}>{s.l}</Badge>
              ))}
            </div>
          </div>

          {/* Two-pane: list + detail */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px',
            minHeight: 0 }}>
            {/* Candidate list (table) */}
            <div style={{ overflow: 'auto', borderRight: '1px solid var(--border-1)' }}>
              {/* Header row */}
              <div style={{ display: 'grid',
                gridTemplateColumns: '2fr 2fr 90px 70px 90px 32px',
                gap: 12, padding: '10px 24px',
                background: 'var(--bg-sunk)',
                borderBottom: '1px solid var(--border-1)',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--ink-3)',
                position: 'sticky', top: 0, zIndex: 1,
              }}>
                <span>Token → Suggestion</span>
                <span>Source · Note</span>
                <span>Hits</span>
                <span>Conf</span>
                <span>Status</span>
                <span />
              </div>
              {C2_CANDIDATES.map(c => {
                const active = c.id === selectedId;
                return (
                  <div key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 2fr 90px 70px 90px 32px',
                      gap: 12, padding: '14px 24px',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--border-1)',
                      background: active ? 'color-mix(in srgb, var(--accent) 6%, var(--bg-surface))' : 'transparent',
                      borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                      cursor: 'pointer',
                      opacity: c.status === 'dismissed' ? 0.55 : 1,
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span className="mono" style={{
                        fontSize: 13, fontWeight: 600, color: 'var(--ink-1)',
                        borderBottom: `2px solid var(--${C2_SRC_TONE[c.src] === 'gt' ? 'gt' : C2_SRC_TONE[c.src]})`,
                        textDecoration: c.status === 'dismissed' ? 'line-through' : 'none',
                      }}>{c.token}</span>
                      <Icon name="arrowR" size={11} style={{ color: 'var(--ink-4)' }} />
                      <span className="mono" style={{
                        fontSize: 13, color: 'var(--exact)',
                        textDecoration: c.status === 'dismissed' ? 'line-through' : 'none',
                      }}>{c.sug}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                      <Badge tone={C2_SRC_TONE[c.src]} mono style={{ alignSelf: 'flex-start' }}>
                        {C2_SRC_LABEL[c.src]}
                      </Badge>
                      <span style={{ fontSize: 11, color: 'var(--ink-3)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.note}
                      </span>
                    </div>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--ink-1)' }}>×{c.hits}</span>
                    <span className="mono" style={{
                      fontSize: 12,
                      color: c.conf >= 0.85 ? 'var(--exact)' : c.conf >= 0.6 ? 'var(--fuzzy)' : 'var(--mismatch)',
                    }}>{c.conf.toFixed(2)}</span>
                    <Badge tone={C2_STATUS_TONE[c.status]} mono>{C2_STATUS_LABEL[c.status]}</Badge>
                    <Icon name="chevR" size={14} style={{ color: 'var(--ink-4)' }} />
                  </div>
                );
              })}

              {/* Bulk action bar */}
              <div style={{
                position: 'sticky', bottom: 0,
                padding: '10px 24px', borderTop: '1px solid var(--border-1)',
                background: 'var(--bg-surface)',
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 11.5, color: 'var(--ink-3)',
              }}>
                <span>4 pending · 2 strong matches (conf ≥ 0.85) ready to promote in bulk</span>
                <span style={{ flex: 1 }} />
                <Button size="sm" variant="default">Dismiss all OCR ≥ noise</Button>
                <Button size="sm" variant="primary" icon="arrowUp">Promote strong matches</Button>
              </div>
            </div>

            {/* Right detail panel */}
            <div style={{ overflow: 'auto', background: 'var(--bg-page)',
              padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {selected ? <CandidateDetail c={selected} /> : null}
            </div>
          </div>
        </div>
      </div>

      <ServerFooter />
    </div>
  );
}

function CandidateDetail({ c }) {
  return (
    <>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--ink-3)' }}>Candidate</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink-1)',
            borderBottom: `2px solid var(--${C2_SRC_TONE[c.src]})` }}>{c.token}</span>
          <Icon name="arrowR" size={16} style={{ color: 'var(--ink-3)' }} />
          <span className="mono" style={{ fontSize: 22, fontWeight: 500, color: 'var(--exact)' }}>{c.sug}</span>
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Badge tone={C2_SRC_TONE[c.src]} mono>{C2_SRC_LABEL[c.src]}</Badge>
          <Badge tone={C2_STATUS_TONE[c.status]} mono>{C2_STATUS_LABEL[c.status]}</Badge>
          <Badge mono>{c.hits} hits</Badge>
          <Badge tone={c.conf >= 0.85 ? 'exact' : 'fuzzy'} mono>conf {c.conf.toFixed(2)}</Badge>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
          Evidence · 3 of {c.hits} contexts
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { p: 'p.047', l: 'with a ', mid: c.token, r: ' pale gold of morning sun' },
            { p: 'p.048', l: 'her ', mid: c.token, r: ' habit of arriving early' },
            { p: 'p.091', l: 'one ', mid: c.token, r: ' little gesture remained' },
          ].map((ctx, i) => (
            <div key={i} style={{
              padding: '8px 10px', background: 'var(--bg-surface)',
              border: '1px solid var(--border-1)', borderRadius: 5,
              fontFamily: 'Georgia, serif', fontSize: 12.5, color: 'var(--ink-2)',
              lineHeight: 1.5,
            }}>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)',
                marginRight: 8, fontFamily: 'var(--mono-font)' }}>{ctx.p}</span>
              {ctx.l}
              <span className="mono" style={{ fontWeight: 600, color: 'var(--ink-1)',
                borderBottom: `2px solid var(--${C2_SRC_TONE[c.src]})` }}>{ctx.mid}</span>
              {ctx.r}
            </div>
          ))}
          <Button size="sm" variant="ghost" iconRight="arrowR" style={{ alignSelf: 'flex-start' }}>
            See all {c.hits} occurrences
          </Button>
        </div>
      </div>

      {/* Promote preview */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
        borderRadius: 8, padding: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Icon name="arrowUp" size={14} style={{ color: 'var(--gt)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-1)' }}>Promote to global library</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 10 }}>
          Creates a new rule in <span className="mono" style={{ color: 'var(--ink-2)' }}>Library → Scannos</span>.
          This book is recorded as the originating evidence.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', rowGap: 8,
          fontSize: 11.5, alignItems: 'center' }}>
          <span style={{ color: 'var(--ink-3)' }}>Pattern</span>
          <span className="mono" style={{ color: 'var(--ink-1)',
            background: 'var(--bg-sunk)', padding: '3px 7px', borderRadius: 4,
            border: '1px solid var(--border-2)' }}>{c.token}</span>

          <span style={{ color: 'var(--ink-3)' }}>Suggest</span>
          <span className="mono" style={{ color: 'var(--ink-1)',
            background: 'var(--bg-sunk)', padding: '3px 7px', borderRadius: 4,
            border: '1px solid var(--border-2)' }}>{c.sug}</span>

          <span style={{ color: 'var(--ink-3)' }}>Match</span>
          <span style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4,
              background: 'var(--bg-raised)', border: '1px solid var(--border-3)',
              color: 'var(--ink-1)' }}>Literal word</span>
            <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4,
              color: 'var(--ink-4)' }}>Regex</span>
          </span>

          <span style={{ color: 'var(--ink-3)' }}>Auto-apply</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 26, height: 14, borderRadius: 99,
              background: 'var(--bg-sunk)', border: '1px solid var(--border-3)',
              position: 'relative' }}>
              <span style={{ position: 'absolute', top: 1, left: 1,
                width: 10, height: 10, borderRadius: 99,
                background: 'var(--ink-3)' }} />
            </span>
            <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>off · highlight only (default)</span>
          </span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <Button size="sm" variant="primary" icon="arrowUp" full>Promote</Button>
          <Button size="sm" variant="default">Edit rule…</Button>
        </div>
      </div>

      {/* Actions footer */}
      <div style={{ marginTop: 'auto', display: 'flex', gap: 8, flexDirection: 'column' }}>
        <Button size="md" variant="default" icon="check" full>Accept as book-local only</Button>
        <Button size="md" variant="danger" icon="x" full>Dismiss for this book</Button>
      </div>
    </>
  );
}

Object.assign(window, { ScannoPromote });
