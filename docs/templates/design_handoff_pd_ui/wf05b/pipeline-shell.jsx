// pipeline-shell.jsx — Project Configure backdrop with Pipeline tab focus.
// Provides the page chrome (breadcrumb + tabs + stage strip + left column controls)
// behind the Validation panel. Static, not interactive.

/* ---------------------- Pipeline stage definitions (lifted from WF-03) ---------------------- */
const STAGE_DEFS = [
  { id: 'source',       short: 'source',      group: 'Source' },
  { id: 'initial_crop', short: 'init crop',   group: 'Source' },
  { id: 'dewarp',       short: 'dewarp',      group: 'Source' },
  { id: 'deskew',       short: 'deskew',      group: 'Source' },
  { id: 'grayscale',    short: 'grayscale',   group: 'Image' },
  { id: 'threshold',    short: 'threshold',   group: 'Image' },
  { id: 'denoise',      short: 'denoise',     group: 'Image' },
  { id: 'canvas_map',   short: 'canvas',      group: 'Image' },
  { id: 'text_zones',   short: 'zones',       group: 'OCR' },
  { id: 'ocr',          short: 'ocr',         group: 'OCR' },
  { id: 'spellcheck',   short: 'spell',       group: 'OCR' },
  { id: 'scannos',      short: 'scannos',     group: 'OCR', optional: true },
  { id: 'text_review',  short: 'review',      group: 'OCR' },
  { id: 'illust',       short: 'illust',      group: 'Pack' },
  { id: 'hyphen_join',  short: 'hyphen',      group: 'Pack' },
  { id: 'regex',        short: 'regex',       group: 'Pack' },
  { id: 'page_split',   short: 'split',       group: 'Pack' },
  { id: 'proof_pack',   short: 'proof',       group: 'Pack' },
  { id: 'build_package',short: 'package',     group: 'Pack' },
  { id: 'validation',   short: 'validate',    group: 'Pack' },
  { id: 'zip',          short: 'zip',         group: 'Pack' },
  { id: 'submit_check', short: 'submit',      group: 'Pack' },
  { id: 'archive',      short: 'archive',     group: 'Pack' },
];

/* ---------------------- Stage strip — matches WF-03 pattern ---------------------- */
const StageContextStrip = ({ currentStage = 'validation', running = false, flagged, dirty }) => {
  const idx = Math.max(0, STAGE_DEFS.findIndex(s => s.id === currentStage));
  const cur = STAGE_DEFS[idx];
  const stageColor = running ? 'var(--ocr)' : 'var(--exact)';
  return (
    <div style={{
      margin: '14px 40px 0', position: 'relative',
      borderRadius: 8, border: '1px solid var(--border-1)',
      background: 'var(--bg-surface)', boxShadow: 'none',
      padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden',
    }}>
      {/* Left: stage label + meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto', minWidth: 230 }}>
        <div style={{
          fontSize: 10.5, fontWeight: 600, letterSpacing: '.06em',
          textTransform: 'uppercase', color: 'var(--ink-4)',
        }}>Stage</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '4px 10px', borderRadius: 7,
          border: `1px solid color-mix(in oklab, ${stageColor} 50%, var(--border-1))`,
          background: `color-mix(in oklab, ${stageColor} 10%, var(--bg-surface))`,
          cursor: 'pointer',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 99, background: stageColor,
            animation: running ? 'pgd-pulse 1.4s ease-in-out infinite' : 'none',
          }} />
          <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{cur.id}</span>
          {cur.optional ? (
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
              padding: '1px 5px', borderRadius: 3,
              border: '1px dashed var(--border-3)', color: 'var(--ink-3)',
              textTransform: 'uppercase',
            }}>opt</span>
          ) : null}
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{idx + 1}/{STAGE_DEFS.length}</span>
          <Icon name="chevD" size={12} style={{ color: 'var(--ink-3)', marginLeft: 2 }} />
        </div>
        <KeyCap>⌘P</KeyCap>
      </div>
      <Divider vertical style={{ height: 22 }} />

      {/* Center: 22-dot pipeline visualization */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3, minWidth: 0, overflow: 'hidden' }}>
        {STAGE_DEFS.map((s, i) => {
          const isCur = i === idx;
          const isDone = i < idx;
          return (
            <React.Fragment key={s.id}>
              {isCur ? (
                <div title={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
                  borderRadius: 6, cursor: 'pointer',
                  background: `color-mix(in oklab, ${stageColor} 14%, var(--bg-surface))`,
                  border: `1px solid color-mix(in oklab, ${stageColor} 60%, var(--border-1))`,
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: 99, background: stageColor,
                    animation: running ? 'pgd-pulse 1.4s ease-in-out infinite' : 'none',
                  }} />
                  <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-1)' }}>{s.short}</span>
                </div>
              ) : (
                <div title={`${i + 1}. ${s.id}${s.optional ? ' (optional)' : ''}`} style={{
                  width: 16, height: 22, borderRadius: 4, cursor: 'pointer',
                  display: 'grid', placeItems: 'center',
                }}>
                  <span style={{
                    width: 9, height: 9, borderRadius: 99,
                    background: isDone ? 'var(--exact)' : 'var(--ink-4)',
                    opacity: isDone ? 1 : 0.55,
                    border: s.optional
                      ? '1px dashed var(--border-3)'
                      : (isDone
                          ? '1px solid color-mix(in oklab, var(--exact) 60%, transparent)'
                          : '1px solid var(--border-2)'),
                  }} />
                </div>
              )}
              {i < STAGE_DEFS.length - 1 ? <span style={{ width: 4, height: 1, background: 'var(--border-2)' }} /> : null}
            </React.Fragment>
          );
        })}
      </div>
      <Divider vertical style={{ height: 22 }} />

      <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', flex: '0 0 auto' }}>
        {flagged != null ? (
          <><span style={{ color: 'var(--mismatch)', fontWeight: 600 }}>{flagged}</span> errors</>
        ) : null}
        {flagged != null && dirty != null ? <span style={{ color: 'var(--ink-4)' }}> · </span> : null}
        {dirty != null ? (
          <><span style={{ color: 'var(--fuzzy)', fontWeight: 600 }}>{dirty}</span> warnings</>
        ) : null}
        {flagged == null && dirty == null ? (
          <span style={{ color: 'var(--exact)', fontWeight: 600 }}>all checks green</span>
        ) : null}
      </div>
      <div style={{ display: 'flex', gap: 4, flex: '0 0 auto' }}>
        <Button variant="outline" size="sm" icon="chevL">Prev</Button>
        <Button variant="primary" size="sm" iconRight="chevR" disabled={!!flagged}>Next</Button>
      </div>
    </div>
  );
};

/* ------------- Pipeline tab — left column (Run-all, banners, disk) -------------- */
const RunAllDirtyPanel = ({ stage = 'idle' }) => (
  <div style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
    borderRadius: 8, padding: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>Run all dirty stages</div>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>0 dirty</span>
    </div>
    <p style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
      All stages clean. Build package below to assemble the upload zip.
    </p>
    <div style={{ marginTop: 12 }}>
      <Button variant="outline" full disabled>No dirty stages</Button>
    </div>
  </div>
);

const BuildPackagePanel = ({ state = 'done', filename = 'belloc-survivals_pgdp.zip', pages = 387 }) => {
  const isDone = state === 'done';
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
      borderRadius: 8, padding: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}>Build package</div>
        <Badge tone={isDone ? 'clean' : 'running'} mono>
          {isDone ? 'built' : 'running'}
        </Badge>
      </div>
      <div className="mono" style={{ marginTop: 8, fontSize: 11.5, color: 'var(--ink-2)' }}>{filename}</div>
      <div className="mono" style={{ marginTop: 2, fontSize: 11, color: 'var(--ink-4)' }}>{pages} pages · 28.4 MB</div>
    </div>
  );
};

const DiskCostBanner = () => (
  <div style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
    borderRadius: 8, padding: '8px 10px',
    display: 'flex', alignItems: 'center', gap: 10,
  }}>
    <Icon name="hardDrive" size={15} style={{ color: 'var(--ink-3)' }} />
    <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-2)' }}>
      Stage artifacts: <span className="mono" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>1.84&nbsp;GB</span>
    </div>
    <span style={{ fontSize: 11.5, color: 'var(--ink-3)', cursor: 'pointer' }}>Prune…</span>
  </div>
);

/* ----------- ProjectConfigureFrame: PageHeader + Tabs + 2-col grid ----------- */
const Tab = ({ label, count, active }) => (
  <div style={{
    position: 'relative',
    padding: '0 12px', height: 36, display: 'inline-flex', alignItems: 'center', gap: 6,
    color: active ? 'var(--ink-1)' : 'var(--ink-3)',
    fontSize: 12, fontWeight: 500, cursor: 'pointer',
  }}>
    {label}
    {count != null ? (
      <span className="mono" style={{
        fontSize: 10, padding: '1px 5px', borderRadius: 4,
        background: active ? 'color-mix(in srgb, var(--accent) 20%, transparent)' : 'var(--bg-raised)',
        color: active ? 'var(--accent)' : 'var(--ink-3)',
      }}>{count}</span>
    ) : null}
    {active ? (
      <span style={{
        position: 'absolute', left: 8, right: 8, bottom: -1, height: 2,
        background: 'var(--accent)', borderRadius: '2px 2px 0 0',
      }} />
    ) : null}
  </div>
);

const ProjectConfigureFrame = ({ children, stripNode, theme = 'light', currentTab = 'pipeline' }) => (
  <div className="pgd" data-theme={theme} style={{
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    background: 'var(--bg-page)',
  }}>
    <TopNav />
    <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Breadcrumb + title */}
      <div style={{ padding: '24px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-3)' }}>
          <span style={{ cursor: 'pointer' }}>Projects</span>
          <Icon name="chevR" size={12} />
          <span className="mono" style={{ color: 'var(--ink-2)' }}>belloc-survivals</span>
        </div>
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink-1)' }}>
            Belloc — Survivals &amp; New Arrivals
          </h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" size="sm" icon="bell">Tasks · 2</Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '14px 40px 0', borderBottom: '1px solid var(--border-1)' }}>
        <div style={{ display: 'flex', gap: 22 }}>
          <Tab label="Pipeline" active={currentTab === 'pipeline'} />
          <Tab label="Pages" count="387" active={currentTab === 'pages'} />
          <Tab label="Settings" active={currentTab === 'settings'} />
        </div>
      </div>

      {/* Stage strip — anchored just below the tabs (matches WF-03 pattern) */}
      {stripNode}

      {/* Stage content area — single column; the validation panel is the stage */}
      <div style={{ flex: 1, padding: '20px 40px 28px', overflow: 'auto' }}>
        <div style={{ maxWidth: 960, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {children}
        </div>
      </div>
    </main>
    <ServerFooter />
  </div>
);

Object.assign(window, {
  STAGE_DEFS, StageContextStrip,
  RunAllDirtyPanel, BuildPackagePanel, DiskCostBanner,
  Tab, ProjectConfigureFrame,
});
