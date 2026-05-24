// scanno-capture.jsx — C1: Page Workbench with suspicion overlay.
// Goal: show the proofing surface where pipeline-produced annotations land,
// and the inline gesture that turns a selected token into a book-local candidate.

const { useState: useS5bC1 } = React;

/* Tokens — pre-tokenized for visual control. Each item is either a plain
   string or {t, sus, src, conf, sug, id, ctx} where sus marks a suspicion. */
const C1_PAGE_TITLE = 'Chapter VII — The Hollow Road';
const C1_PARAGRAPHS = [
  // Each paragraph is an array of token objects / strings.
  [
    { t: 'A' }, { t: 'thin' }, { t: 'wreath' }, { t: 'of' }, { t: 'mist' }, { t: 'hung' },
    { t: 'over' }, { t: 'the' }, { t: 'hollow' }, { t: 'road', punct: ',' }, { t: 'and' },
    { t: 'the' }, { t: 'sun', punct: ',' }, { t: 'now' }, { t: 'risen' },
    { t: 'abovc', sus: 'mismatch', src: 'rule', conf: 0.96, sug: 'above', id: 's1',
      ctx: 'risen ⟦abovc⟧ the eastern ridge' },
    { t: 'the' }, { t: 'eastern' }, { t: 'ridge', punct: ',' }, { t: 'lit' }, { t: 'the' },
    { t: 'damp' }, { t: 'stones' }, { t: 'with' }, { t: 'a' },
    { t: 'curi0us', sus: 'ocr', src: 'ocr', conf: 0.42, sug: 'curious', id: 's2',
      ctx: 'with a ⟦curi0us⟧ pale gold' },
    { t: 'pale' }, { t: 'gold', punct: '.' },
  ],
  [
    { t: 'Halloran' }, { t: 'walked' }, { t: 'ahead', punct: ',' }, { t: 'his' },
    { t: 'great' },
    { t: 'cont', sus: 'fuzzy', src: 'manual', conf: 0.71, sug: 'coat', id: 's3',
      ctx: 'his great ⟦cont⟧ dragging' },
    { t: 'dragging' }, { t: 'in' }, { t: 'the' }, { t: 'wet' }, { t: 'leaves' },
    { t: 'and' }, { t: 'his' },
    { t: 'arn', sus: 'mismatch', src: 'rule', conf: 0.88, sug: 'arm', id: 's4',
      ctx: 'and his ⟦arn⟧ flung out' },
    { t: 'flung' }, { t: 'out' }, { t: 'against' }, { t: 'the' }, { t: 'cold', punct: '.' },
    { t: 'He' }, { t: 'did' }, { t: 'not' }, { t: 'speak' }, { t: 'until' }, { t: 'we' },
    { t: 'had' }, { t: 'come' }, { t: 'within' }, { t: 'sight' }, { t: 'of' }, { t: 'the' },
    { t: 'mill', punct: ',' }, { t: 'and' }, { t: 'even' }, { t: 'then' }, { t: 'his' },
    { t: 'words' }, { t: 'were' },
    { t: 'modcrn', sus: 'fuzzy', src: 'rule', conf: 0.64, sug: 'modern', id: 's5',
      ctx: 'his words were ⟦modcrn⟧ and brisk' },
    { t: 'and' }, { t: 'brisk', punct: '—' }, { t: 'as' }, { t: 'if' }, { t: 'he' },
    { t: 'wished' }, { t: 'to' }, { t: 'dismiss' }, { t: 'the' }, { t: 'morning', punct: '.' },
  ],
  [
    { t: '"You' }, { t: 'will' }, { t: 'find' }, { t: 'her' }, { t: 'here', punct: ',"' },
    { t: 'he' }, { t: 'said', punct: ',' }, { t: 'with' }, { t: 'a' },
    { t: 'curi0us', sus: 'ocr', src: 'ocr', conf: 0.42, sug: 'curious', id: 's6',
      ctx: 'with a ⟦curi0us⟧ small gesture' },
    { t: 'small' }, { t: 'gesture' }, { t: 'of' }, { t: 'the' }, { t: 'hand', punct: ',' },
    { t: 'and' }, { t: 'he' }, { t: 'would' }, { t: 'say' }, { t: 'no' }, { t: 'more', punct: '.' },
  ],
];

/* Active selection for the inline-mark popover demo */
const C1_SELECTED = { word: 'modcrn', paraIdx: 1, tokenIdx: 22 };

const C1_SUSPICIONS = [
  { id: 's2', token: 'curi0us', sug: 'curious', src: 'ocr',    conf: 0.42, hits: 2,
    note: 'OCR confidence below 0.50' },
  { id: 's3', token: 'cont',    sug: 'coat',    src: 'manual', conf: 0.71, hits: 1,
    note: 'Marked on page 044 by user' },
  { id: 's5', token: 'modcrn',  sug: 'modern',  src: 'rule',   conf: 0.64, hits: 3,
    note: 'Matches global rule “c↔e in <…>cm/cn”' },
  { id: 's4', token: 'arn',     sug: 'arm',     src: 'rule',   conf: 0.88, hits: 1,
    note: 'Matches global rule “n↔m word-final”' },
  { id: 's1', token: 'abovc',   sug: 'above',   src: 'rule',   conf: 0.96, hits: 1,
    note: 'Matches global rule “c↔e word-final”' },
];

const SRC_TONE = { ocr: 'ocr', manual: 'gt', rule: 'fuzzy' };
const SRC_LABEL = { ocr: 'OCR low-conf', manual: 'Manual mark', rule: 'Rule match' };
const SRC_UNDERLINE = {
  ocr:    'var(--ocr)',
  manual: 'var(--gt)',
  rule:   'var(--fuzzy)',
};

function ScannoToken({ tok, active, onClick }) {
  const color = SRC_UNDERLINE[tok.src] || 'var(--fuzzy)';
  return (
    <span
      onClick={onClick}
      style={{
        background: active ? 'color-mix(in srgb, var(--accent) 22%, transparent)' : 'transparent',
        borderBottom: `2px solid ${color}`,
        padding: '0 1px',
        cursor: 'pointer',
        borderRadius: 2,
      }}
      title={`${SRC_LABEL[tok.src]} · suggested “${tok.sug}”`}
    >{tok.t}</span>
  );
}

function ScannoCapture({ theme = 'dark' }) {
  const [activeId, setActiveId] = useS5bC1('s5');

  return (
    <div className="pgd" data-theme={theme} style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-page)', overflow: 'hidden',
    }}>
      <TopNav />

      {/* Page Workbench breadcrumb + tabs */}
      <div style={{
        flex: '0 0 auto', padding: '14px 24px 0',
        borderBottom: '1px solid var(--border-1)',
        background: 'var(--bg-page)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11.5, color: 'var(--ink-3)', fontFamily: 'var(--mono-font)' }}>
          <span>projects</span>
          <Icon name="chevR" size={11} />
          <span>bellocsurvivials</span>
          <Icon name="chevR" size={11} />
          <span style={{ color: 'var(--ink-2)' }}>page 047 / 232</span>
          <span style={{ width: 12 }} />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '2px 7px', borderRadius: 4,
            background: 'color-mix(in srgb, var(--fuzzy) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--fuzzy) 30%, transparent)',
            color: 'var(--fuzzy)', fontSize: 10.5,
          }}>
            <Icon name="sparkles" size={10} />
            pipeline: scannos · ran 4m ago
          </span>
          <span style={{ flex: 1 }} />
          <Badge tone="review" mono>Review</Badge>
          <span style={{ width: 12 }} />
          <span style={{ color: 'var(--ink-3)' }}>← K · J →</span>
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 0 }}>
          {[
            { k: 'image', l: 'Image' },
            { k: 'text',  l: 'Text', active: true,
              badge: <Badge tone="fuzzy" mono style={{ marginLeft: 6, height: 14, fontSize: 9 }}>5</Badge> },
            { k: 'layout', l: 'Layout' },
            { k: 'quality', l: 'Quality' },
            { k: 'ocr', l: 'OCR' },
          ].map(tab => (
            <div key={tab.k} style={{
              padding: '8px 14px 9px', fontSize: 12,
              color: tab.active ? 'var(--ink-1)' : 'var(--ink-3)',
              fontWeight: tab.active ? 600 : 500,
              borderBottom: tab.active ? '2px solid var(--accent)' : '2px solid transparent',
              display: 'flex', alignItems: 'center',
              marginBottom: -1,
            }}>{tab.l}{tab.badge || null}</div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '380px 1fr 380px',
        gap: 0, minHeight: 0, overflow: 'hidden' }}>

        {/* LEFT — page image */}
        <div style={{ borderRight: '1px solid var(--border-1)',
          background: 'var(--bg-sunk)', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--ink-3)' }}>Source page</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <Button size="sm" variant="ghost" icon="eye">Fit</Button>
              <Button size="sm" variant="ghost" icon="search">Zoom</Button>
            </div>
          </div>
          <div style={{
            flex: 1, position: 'relative',
            background: 'repeating-linear-gradient(0deg, #1a1a22, #1a1a22 2px, #181820 2px, #181820 4px)',
            border: '1px solid var(--border-2)', borderRadius: 4, overflow: 'hidden',
          }}>
            {/* Fake page content overlay */}
            <div style={{ position: 'absolute', inset: '16% 14% 16% 14%',
              display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: 'serif', fontSize: 14, color: 'var(--ink-3)',
                textAlign: 'center', marginBottom: 8 }}>VII</div>
              {Array.from({ length: 22 }).map((_, i) => (
                <div key={i} style={{
                  height: 4, background: 'var(--border-2)',
                  width: `${72 + ((i * 13) % 25)}%`, opacity: 0.55,
                  borderRadius: 1,
                }} />
              ))}
            </div>
            {/* Suspicion crops as overlay markers */}
            {[
              { top: '34%', left: '46%', w: 32, c: 'var(--fuzzy)' },
              { top: '50%', left: '28%', w: 28, c: 'var(--ocr)' },
              { top: '62%', left: '52%', w: 30, c: 'var(--fuzzy)' },
            ].map((m, i) => (
              <div key={i} style={{
                position: 'absolute', top: m.top, left: m.left, width: m.w, height: 10,
                border: `1.5px solid ${m.c}`, borderRadius: 2,
                background: `color-mix(in srgb, ${m.c} 12%, transparent)`,
              }} />
            ))}
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)',
            display: 'flex', justifyContent: 'space-between' }}>
            <span>047.tif</span><span>1944 × 2820 · 600 dpi</span>
          </div>
        </div>

        {/* MIDDLE — transcript */}
        <div style={{ position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column' }}>
          {/* Editor toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 20px', borderBottom: '1px solid var(--border-1)',
            background: 'var(--bg-surface)',
          }}>
            <span style={{ fontSize: 12, color: 'var(--ink-1)', fontWeight: 600 }}>Transcript</span>
            <span style={{ color: 'var(--ink-4)' }}>·</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>annotative · changes tracked</span>
            <span style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: 'var(--ink-3)' }}>
              <span>Show:</span>
              {[
                { l: 'All', count: 5, active: true,  tone: 'fuzzy' },
                { l: 'OCR', count: 2, active: true,  tone: 'ocr' },
                { l: 'Rules', count: 3, active: true, tone: 'fuzzy' },
                { l: 'Manual', count: 1, active: true, tone: 'gt' },
              ].map(c => (
                <span key={c.l} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 7px', borderRadius: 99, fontSize: 10.5,
                  background: c.active
                    ? `color-mix(in srgb, var(--${c.tone}) 10%, transparent)`
                    : 'var(--bg-raised)',
                  color: c.active ? `var(--${c.tone})` : 'var(--ink-3)',
                  border: `1px solid ${c.active ? `color-mix(in srgb, var(--${c.tone}) 33%, transparent)` : 'var(--border-2)'}`,
                  fontWeight: 500,
                }}>
                  {c.l}
                  <span className="mono" style={{ opacity: 0.7 }}>{c.count}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Transcript body */}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px 36px 32px',
            background: 'var(--bg-surface)' }}>
            <div style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 16, lineHeight: 1.75, color: 'var(--ink-1)',
              maxWidth: 600, margin: '0 auto',
            }}>
              <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600,
                color: 'var(--ink-2)', marginBottom: 16, letterSpacing: '0.05em',
                textTransform: 'uppercase', fontFamily: 'var(--ui-font)' }}>
                {C1_PAGE_TITLE}
              </div>
              {C1_PARAGRAPHS.map((para, pi) => (
                <div key={pi} style={{ marginBottom: 14, textIndent: pi === 0 ? 0 : '1.5em' }}>
                  {para.map((tok, ti) => {
                    if (typeof tok === 'string' || !tok.sus) {
                      return <React.Fragment key={ti}>{(tok.t || tok)}{tok.punct || ''}{' '}</React.Fragment>;
                    }
                    const active = tok.id === activeId;
                    return (
                      <React.Fragment key={ti}>
                        <span style={{ position: 'relative' }}>
                          <ScannoToken tok={tok} active={active} onClick={() => setActiveId(tok.id)} />
                          {active && tok.id === 's5' ? <InlineMarkPopover /> : null}
                        </span>
                        {tok.punct || ''}{' '}
                      </React.Fragment>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — suspicion list */}
        <div style={{ borderLeft: '1px solid var(--border-1)',
          background: 'var(--bg-page)', display: 'flex', flexDirection: 'column',
          minHeight: 0 }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border-1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--ink-1)', fontWeight: 600 }}>
                Suspicions on this page
              </span>
              <Badge tone="fuzzy" mono>5</Badge>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-3)' }}>
              Sorted by confidence · click to focus in transcript
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {C1_SUSPICIONS.map(s => {
              const active = s.id === activeId;
              const tone = SRC_TONE[s.src];
              return (
                <div key={s.id}
                  onClick={() => setActiveId(s.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-1)',
                    background: active ? 'color-mix(in srgb, var(--accent) 6%, var(--bg-surface))' : 'transparent',
                    borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                    cursor: 'pointer',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono" style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--ink-1)',
                      borderBottom: `2px solid ${SRC_UNDERLINE[s.src]}`,
                    }}>{s.token}</span>
                    <Icon name="arrowR" size={11} style={{ color: 'var(--ink-4)' }} />
                    <span className="mono" style={{
                      fontSize: 13, fontWeight: 500, color: 'var(--exact)',
                    }}>{s.sug}</span>
                    <span style={{ flex: 1 }} />
                    <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>
                      ×{s.hits}
                    </span>
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge tone={tone} mono>{SRC_LABEL[s.src]}</Badge>
                    <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>
                      conf {s.conf.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                    {s.note}
                  </div>
                  {active ? (
                    <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Button size="sm" variant="primary" icon="check">Accept</Button>
                      <Button size="sm" variant="default">Dismiss</Button>
                      <Button size="sm" variant="default" icon="arrowUp">Promote</Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Footer summary */}
          <div style={{
            borderTop: '1px solid var(--border-1)',
            padding: '10px 16px', background: 'var(--bg-surface)',
            fontSize: 11, color: 'var(--ink-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>Book total: <span style={{ color: 'var(--ink-1)' }} className="mono">47</span> suspicions across <span style={{ color: 'var(--ink-1)' }} className="mono">232</span> pages</span>
            <Button size="sm" variant="ghost" iconRight="arrowR">Triage panel</Button>
          </div>
        </div>
      </div>

      <ServerFooter />
    </div>
  );
}

/* Inline popover that appears when the user selects a token. Shows the
   gesture for marking it as a book-local candidate. */
function InlineMarkPopover() {
  return (
    <div style={{
      position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, 8px)',
      zIndex: 5, width: 320,
      background: 'var(--bg-raised)', border: '1px solid var(--border-3)',
      borderRadius: 8, boxShadow: 'var(--shadow-floating)',
      padding: 14, fontFamily: 'var(--ui-font)',
    }}>
      {/* arrow */}
      <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
        width: 10, height: 10, background: 'var(--bg-raised)',
        borderTop: '1px solid var(--border-3)', borderLeft: '1px solid var(--border-3)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="sparkles" size={13} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-1)' }}>
          Suggestion from global library
        </span>
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="mono" style={{ fontSize: 14, color: 'var(--ink-1)',
          borderBottom: '2px solid var(--fuzzy)' }}>modcrn</span>
        <Icon name="arrowR" size={12} style={{ color: 'var(--ink-4)' }} />
        <span className="mono" style={{ fontSize: 14, color: 'var(--exact)' }}>modern</span>
        <span style={{ flex: 1 }} />
        <Badge tone="fuzzy" mono>0.64</Badge>
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5 }}>
        Matches global rule <span className="mono" style={{ color: 'var(--ink-2)' }}>c↔e in &lt;…&gt;cm/cn</span> ·
        3 hits in this book
      </div>
      <div style={{ marginTop: 12, height: 1, background: 'var(--border-2)' }} />
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button size="sm" variant="primary" icon="check" full>Accept “modern”</Button>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="default" full>Edit…</Button>
          <Button size="sm" variant="default" full>Dismiss</Button>
        </div>
        <Button size="sm" variant="ghost" icon="plus" full>Mark as new candidate…</Button>
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 10.5, color: 'var(--ink-4)' }}>
        <KeyCap>↵</KeyCap><span>accept</span>
        <span style={{ width: 6 }} />
        <KeyCap>esc</KeyCap><span>dismiss</span>
      </div>
    </div>
  );
}

Object.assign(window, { ScannoCapture });
