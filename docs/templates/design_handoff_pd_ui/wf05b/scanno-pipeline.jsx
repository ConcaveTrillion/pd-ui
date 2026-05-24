// scanno-pipeline.jsx — P0: Pipeline cockpit · scannos stage selected.
// Sits between `spellcheck` and `text_review` as an OPTIONAL stage.
// Produces the annotation sidecar that C1 (Page Workbench) surfaces.

const { useState: useS5bP0 } = React;

const P0_PAGES = [
  { p: 47, sus: 5, ocr: 2, rule: 2, manual: 1, hot: true },
  { p: 48, sus: 3, ocr: 1, rule: 2, manual: 0 },
  { p: 49, sus: 4, ocr: 0, rule: 3, manual: 1 },
  { p: 50, sus: 1, ocr: 0, rule: 1, manual: 0 },
  { p: 88, sus: 2, ocr: 0, rule: 2, manual: 0 },
  { p: 89, sus: 0, ocr: 0, rule: 0, manual: 0, clean: true },
  { p: 91, sus: 6, ocr: 4, rule: 2, manual: 0, hot: true },
  { p: 117, sus: 2, ocr: 1, rule: 1, manual: 0 },
  { p: 122, sus: 1, ocr: 0, rule: 0, manual: 1 },
  { p: 184, sus: 3, ocr: 2, rule: 1, manual: 0 },
  { p: 208, sus: 2, ocr: 0, rule: 2, manual: 0 },
  { p: 217, sus: 1, ocr: 0, rule: 1, manual: 0 },
];

function ScannoPipeline({ theme = 'dark' }) {
  const [enabled, setEnabled] = useS5bP0(true);

  return (
    <ProjectConfigureFrame
      theme={theme}
      currentTab="pipeline"
      stripNode={<StageContextStrip currentStage="scannos" />}
    >
      {/* Stage header card */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
        borderRadius: 10, padding: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: 'color-mix(in srgb, var(--fuzzy) 14%, transparent)',
            border: '1px solid color-mix(in srgb, var(--fuzzy) 33%, transparent)',
            display: 'grid', placeItems: 'center', flex: '0 0 auto',
          }}>
            <Icon name="sparkles" size={18} style={{ color: 'var(--fuzzy)' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink-1)',
                margin: 0, letterSpacing: '-0.005em' }}>Scannos</h2>
              <span style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
                padding: '2px 6px', borderRadius: 3,
                border: '1px dashed var(--border-3)', color: 'var(--ink-3)',
                textTransform: 'uppercase',
              }}>optional</span>
              <Badge tone="exact" mono>ran 4m ago</Badge>
            </div>
            <p style={{ marginTop: 6, fontSize: 12.5, color: 'var(--ink-3)',
              maxWidth: 720, lineHeight: 1.55 }}>
              Scans the OCR output against the global scanno library plus per-book candidates,
              and emits a <span className="mono" style={{ color: 'var(--ink-2)' }}>suspicions</span> sidecar
              for each page. <strong style={{ color: 'var(--ink-2)' }}>Annotation only</strong> —
              this stage never mutates text. Auto-apply rules are recorded as explicit edits in the
              change log when the downstream proofing surface accepts them.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            gap: 8, flex: '0 0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Include in pipeline</span>
              <span
                onClick={() => setEnabled(v => !v)}
                style={{
                  width: 32, height: 18, borderRadius: 99,
                  background: enabled ? 'var(--exact)' : 'var(--bg-sunk)',
                  border: `1px solid ${enabled ? 'var(--exact)' : 'var(--border-3)'}`,
                  position: 'relative', cursor: 'pointer',
                }}>
                <span style={{
                  position: 'absolute', top: 1, left: enabled ? 15 : 1,
                  width: 14, height: 14, borderRadius: 99,
                  background: enabled ? 'var(--bg-page)' : 'var(--ink-3)',
                  transition: 'left 100ms',
                }} />
              </span>
            </div>
            <Button size="sm" variant="default" icon="refresh">Re-scan all pages</Button>
          </div>
        </div>

        {/* Stat row */}
        <div style={{
          marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1,
          background: 'var(--border-1)', border: '1px solid var(--border-1)',
          borderRadius: 8, overflow: 'hidden',
        }}>
          {[
            { n: '47',  l: 'total suspicions', tone: 'fuzzy' },
            { n: '232', l: 'pages scanned',    tone: null },
            { n: '23',  l: 'pages with hits',  tone: null },
            { n: '8',   l: 'book candidates',  tone: 'gt',  sub: 'pending triage' },
            { n: '12',  l: 'auto-applied',     tone: 'exact', sub: '2 opted-in rules' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-surface)' }}>
              <div className="mono" style={{
                fontSize: 22, fontWeight: 600,
                color: s.tone ? `var(--${s.tone})` : 'var(--ink-1)',
              }}>{s.n}</div>
              <div style={{ marginTop: 4, fontSize: 11, color: 'var(--ink-3)' }}>{s.l}</div>
              {s.sub ? (
                <div style={{ marginTop: 2, fontSize: 10.5, color: 'var(--ink-4)' }}>{s.sub}</div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Cross-links */}
        <div style={{
          marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap',
          fontSize: 11.5, color: 'var(--ink-3)',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="arrowR" size={11} />
            <span>Book candidates triaged in</span>
            <a style={{ color: 'var(--accent)', textDecoration: 'underline',
              fontFamily: 'var(--mono-font)', fontSize: 11 }}>Settings → Scannos</a>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="arrowR" size={11} />
            <span>Rules and auto-apply configured in</span>
            <a style={{ color: 'var(--accent)', textDecoration: 'underline',
              fontFamily: 'var(--mono-font)', fontSize: 11 }}>Library → Scannos</a>
          </span>
        </div>
      </div>

      {/* Per-page list */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 18px',
          borderBottom: '1px solid var(--border-1)',
          display: 'flex', alignItems: 'center', gap: 14 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)', margin: 0 }}>
            Pages with suspicions
          </h3>
          <Badge mono>12 of 232</Badge>
          <span style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center',
            fontSize: 11, color: 'var(--ink-3)' }}>
            <span>Filter:</span>
            {[
              { l: 'All',  active: true },
              { l: 'Hot (≥4)' },
              { l: 'OCR only' },
              { l: 'Manual only' },
            ].map(f => (
              <span key={f.l} style={{
                padding: '3px 8px', borderRadius: 99, fontSize: 11,
                background: f.active ? 'var(--bg-raised)' : 'transparent',
                color: f.active ? 'var(--ink-1)' : 'var(--ink-3)',
                border: `1px solid ${f.active ? 'var(--border-3)' : 'var(--border-1)'}`,
                fontWeight: f.active ? 600 : 500, cursor: 'pointer',
              }}>{f.l}</span>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '72px 1fr 90px 90px 90px 100px 120px',
          gap: 12, padding: '8px 18px',
          background: 'var(--bg-sunk)',
          borderBottom: '1px solid var(--border-1)',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--ink-3)',
        }}>
          <span>Page</span><span>Density</span>
          <span>Rule</span><span>OCR</span><span>Manual</span>
          <span>Total</span><span style={{ textAlign: 'right' }}>Action</span>
        </div>

        {P0_PAGES.map(p => (
          <div key={p.p} style={{
            display: 'grid',
            gridTemplateColumns: '72px 1fr 90px 90px 90px 100px 120px',
            gap: 12, padding: '12px 18px',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-1)',
            opacity: p.clean ? 0.55 : 1,
          }}>
            <span className="mono" style={{ fontSize: 12, fontWeight: 600,
              color: 'var(--ink-1)' }}>p.{p.p}</span>
            {/* Density bar */}
            <div style={{ display: 'flex', height: 10, borderRadius: 2, overflow: 'hidden',
              background: p.clean ? 'var(--bg-sunk)' : 'transparent', maxWidth: 360 }}>
              {p.rule ? <span style={{ flex: p.rule, background: 'var(--fuzzy)' }} /> : null}
              {p.ocr  ? <span style={{ flex: p.ocr,  background: 'var(--ocr)'   }} /> : null}
              {p.manual ? <span style={{ flex: p.manual, background: 'var(--gt)' }} /> : null}
              {p.clean ? (
                <span style={{ flex: 1, display: 'grid', placeItems: 'center',
                  fontSize: 10, color: 'var(--ink-4)' }}>clean</span>
              ) : null}
            </div>
            <span className="mono" style={{ fontSize: 12,
              color: p.rule ? 'var(--fuzzy)' : 'var(--ink-4)' }}>{p.rule || '—'}</span>
            <span className="mono" style={{ fontSize: 12,
              color: p.ocr ? 'var(--ocr)' : 'var(--ink-4)' }}>{p.ocr || '—'}</span>
            <span className="mono" style={{ fontSize: 12,
              color: p.manual ? 'var(--gt)' : 'var(--ink-4)' }}>{p.manual || '—'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="mono" style={{ fontSize: 13, fontWeight: 600,
                color: 'var(--ink-1)' }}>{p.sus}</span>
              {p.hot ? <Badge tone="mismatch" mono style={{ height: 14, fontSize: 9 }}>hot</Badge> : null}
            </span>
            <Button size="sm" variant={p.hot ? 'primary' : 'default'} iconRight="arrowR"
              style={{ justifySelf: 'end' }}>
              Open page
            </Button>
          </div>
        ))}

        <div style={{
          padding: '10px 18px', background: 'var(--bg-sunk)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 11, color: 'var(--ink-3)',
        }}>
          <span>Showing 12 pages with at least one suspicion · 209 clean pages hidden</span>
          <Button size="sm" variant="ghost">Show all 232</Button>
        </div>
      </div>

      {/* Footnote: optionality + skip behavior */}
      <div style={{
        padding: '12px 14px', borderRadius: 8,
        background: 'color-mix(in srgb, var(--ocr) 6%, var(--bg-surface))',
        border: '1px dashed color-mix(in srgb, var(--ocr) 30%, var(--border-2))',
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <Icon name="info" size={14} style={{ color: 'var(--ocr)', marginTop: 1, flex: '0 0 auto' }} />
        <div style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
          Scannos is optional. With the stage disabled, OCR output flows directly to <span className="mono"
          style={{ color: 'var(--ink-1)' }}>text_review</span> with no suspicion sidecar — proofers still see
          the raw text and can mark scannos manually inside the Page Workbench. Re-enable later to backfill.
          Hobbyist-direct pipelines may want to leave this on with auto-apply rules opted in for the
          high-confidence tail; PGDP-bound pipelines should leave it on and keep auto-apply mostly off.
        </div>
      </div>
    </ProjectConfigureFrame>
  );
}

Object.assign(window, { ScannoPipeline });
