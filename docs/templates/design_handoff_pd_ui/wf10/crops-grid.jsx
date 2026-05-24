// crops-grid.jsx — Batch Crop Review surface.
// Standalone subpage at /projects/:id/crops. Stage strip pinned to canvas_map
// (this is a review pass over canvas_map output). Below the strip:
// toolbar (filter chips + density toggle + sort) · grid · sticky bulk action bar.

/* ---------------------- Flag taxonomy ----------------------
   For the canvas_map review surface specifically. Aligns with WF-03's
   initial_crop + canvas_map flag groups but unified here. */
const CROP_FLAGS = {
  cropped:    { label: 'over-crop',  tone: 'var(--mismatch)' },
  asymmetric: { label: 'asymmetric', tone: 'var(--gt)' },
  loose:      { label: 'loose',      tone: 'var(--ocr)' },
  overflow:   { label: 'overflow',   tone: 'var(--mismatch)' },
  blank:      { label: 'blank',      tone: 'var(--ink-3)' },
  misaligned: { label: 'misaligned', tone: 'var(--gt)' },
  deskewFail: { label: 'deskew·fail',tone: 'var(--fuzzy)' },
  nearEdge:   { label: 'near edge',  tone: 'var(--fuzzy)' },
};

/* ---------------------- Sample data (~32 cells) ---------------------- */
const CROP_ROWS = (() => {
  const rows = [];
  for (let i = 12; i < 44; i++) {
    const idx = i;
    const prefix = `p${String(i + 1).padStart(3, '0')}`;
    rows.push({ idx, prefix, stage: 'clean' });
  }
  // sprinkle flags onto a handful
  const flagPlan = {
    p015: ['asymmetric'],
    p019: ['cropped', 'nearEdge'],
    p024: ['loose'],
    p028: ['overflow'],
    p031: ['deskewFail'],
    p035: ['blank'],
    p038: ['cropped', 'asymmetric'],
    p042: ['misaligned'],
  };
  return rows.map(r => flagPlan[r.prefix]
    ? { ...r, flags: flagPlan[r.prefix], stage: 'dirty' }
    : r);
})();

/* ---------------------- A single thumb cell ----------------------
   Three densities — S/M/L drive size + flag/badge display.
   Cell body renders a stylised page (no real scan; placeholder). */
const DENSITY_CFG = {
  S: { col: 9, ar: 0.78, gap: 8,  pageInset: '6% 10%',  numFs: 9.5,  flagMax: 1, flagFs: 8.5, barH: 22 },
  M: { col: 6, ar: 0.78, gap: 12, pageInset: '8% 12%',  numFs: 11,   flagMax: 2, flagFs: 9,   barH: 26 },
  L: { col: 4, ar: 0.80, gap: 16, pageInset: '10% 14%', numFs: 12.5, flagMax: 4, flagFs: 10,  barH: 30 },
};

const FlagPill = ({ kind, density = 'M' }) => {
  const f = CROP_FLAGS[kind]; if (!f) return null;
  const cfg = DENSITY_CFG[density];
  if (density === 'S') {
    // tiny dot only
    return <span style={{
      width: 8, height: 8, borderRadius: 99, background: f.tone,
      border: '1.5px solid var(--bg-surface)',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
    }} />;
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: density === 'L' ? 18 : 16, padding: '0 6px', borderRadius: 4,
      fontSize: cfg.flagFs, fontWeight: 600, letterSpacing: '0.02em',
      background: `color-mix(in srgb, ${f.tone} 18%, rgba(12,12,16,0.92))`,
      color: f.tone,
      border: `1px solid color-mix(in srgb, ${f.tone} 50%, transparent)`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: f.tone }} />
      {f.label}
    </span>
  );
};

const CropThumb = ({ row, density = 'M', selected, hovered, dim, focused }) => {
  const cfg = DENSITY_CFG[density];
  const flags = (row.flags || []).slice(0, cfg.flagMax);
  const extra = (row.flags || []).length - flags.length;
  const showCheckbox = density !== 'S' && (selected || hovered);
  return (
    <div style={{
      position: 'relative', borderRadius: 5,
      border: `1px solid ${selected || focused ? 'var(--accent)' : 'var(--border-1)'}`,
      boxShadow: selected || focused
        ? '0 0 0 1px color-mix(in srgb, var(--accent) 60%, transparent)'
        : 'none',
      background: 'var(--bg-surface)',
      aspectRatio: cfg.ar,
      overflow: 'hidden',
      opacity: dim ? 0.4 : 1,
      cursor: 'pointer',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Page body */}
      <div style={{ flex: 1, position: 'relative', background: '#fbf9f4' }}>
        {/* paper striped text */}
        <div style={{
          position: 'absolute', inset: cfg.pageInset,
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 ${density==='S'?3:4}px, rgba(58,44,28,0.55) ${density==='S'?3:4}px ${density==='S'?4:5}px, transparent ${density==='S'?4:5}px ${density==='S'?7:8}px)`,
        }} />
        {/* page-number stripe near bottom */}
        <div style={{
          position: 'absolute', left: '40%', right: '40%',
          bottom: density === 'S' ? 6 : 10,
          height: density === 'S' ? 2 : 3,
          background: 'rgba(58,44,28,0.65)',
        }} />
        {/* simulated crop bbox — drawn slightly off when flagged */}
        {row.flags ? (
          <div style={{
            position: 'absolute',
            top: row.flags.includes('cropped') ? '14%' : '6%',
            left: row.flags.includes('asymmetric') ? '20%' : '6%',
            right: row.flags.includes('asymmetric') ? '6%' : '6%',
            bottom: row.flags.includes('cropped') ? '14%' : '6%',
            border: `1.5px solid ${CROP_FLAGS[row.flags[0]].tone}`,
            borderRadius: 2,
            mixBlendMode: 'normal',
          }} />
        ) : null}

        {/* checkbox top-left (M/L only) */}
        {showCheckbox ? (
          <span style={{
            position: 'absolute', top: 6, left: 6,
            width: density === 'L' ? 18 : 16, height: density === 'L' ? 18 : 16,
            borderRadius: 3,
            background: selected ? 'var(--accent)' : 'rgba(12,12,16,0.85)',
            border: selected ? 'none' : '1px solid rgba(240,240,242,0.4)',
            display: 'grid', placeItems: 'center', color: 'var(--accent-ink)',
          }}>
            {selected ? <Icon name="check" size={density === 'L' ? 11 : 10} stroke={3} /> : null}
          </span>
        ) : selected ? (
          <span style={{
            position: 'absolute', top: 4, left: 4, width: 12, height: 12, borderRadius: 2,
            background: 'var(--accent)', display: 'grid', placeItems: 'center',
            color: 'var(--accent-ink)',
          }}><Icon name="check" size={8} stroke={3} /></span>
        ) : null}

        {/* flag badges top-right */}
        <div style={{
          position: 'absolute', top: density === 'S' ? 4 : 6, right: density === 'S' ? 4 : 6,
          display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end',
        }}>
          {flags.map((f, i) => <FlagPill key={i} kind={f} density={density} />)}
          {extra > 0 && density !== 'S' ? (
            <span style={{
              fontSize: cfg.flagFs, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
              background: 'rgba(12,12,16,0.85)', color: '#f0f0f2',
            }}>+{extra}</span>
          ) : null}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        height: cfg.barH, padding: `0 ${density === 'S' ? 6 : 8}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#0c0c10', color: '#f0f0f2',
        borderTop: '1px solid var(--border-1)',
      }}>
        <span className="mono" style={{ fontSize: cfg.numFs, fontWeight: 600 }}>{row.prefix}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {density !== 'S' ? (
            <span className="mono" style={{ fontSize: cfg.numFs - 1, opacity: 0.55 }}>
              {row.flags ? row.flags.length + ' flag' + (row.flags.length>1?'s':'') : 'clean'}
            </span>
          ) : null}
          <span style={{
            width: density === 'S' ? 5 : 6, height: density === 'S' ? 5 : 6, borderRadius: 99,
            background:
              row.stage === 'clean' ? 'var(--exact)' :
              row.stage === 'dirty' ? 'var(--fuzzy)' :
              row.stage === 'running' ? 'var(--ocr)' :
              row.stage === 'failed' ? 'var(--mismatch)' :
              'var(--ink-4)',
            boxShadow: row.stage === 'running' ? '0 0 0 2px color-mix(in srgb, var(--ocr) 30%, transparent)' : 'none',
          }} />
        </span>
      </div>
    </div>
  );
};

/* ---------------------- Filter chip ---------------------- */
const FilterChip = ({ on, children, count, tone, onClick }) => (
  <span onClick={onClick} style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    height: 22, padding: '0 8px', borderRadius: 4, cursor: 'pointer',
    background: on
      ? (tone
          ? `color-mix(in srgb, ${tone} 14%, transparent)`
          : 'color-mix(in srgb, var(--accent) 14%, transparent)')
      : 'var(--bg-raised)',
    border: on
      ? (tone
          ? `1px solid color-mix(in srgb, ${tone} 45%, transparent)`
          : '1px solid color-mix(in srgb, var(--accent) 45%, transparent)')
      : '1px solid var(--border-2)',
    color: on ? (tone || 'var(--accent)') : 'var(--ink-2)',
    fontSize: 11, fontWeight: 500,
  }}>
    {tone ? <span style={{ width: 6, height: 6, borderRadius: 99, background: tone }} /> : null}
    {children}
    {count != null ? (
      <span className="mono" style={{
        fontSize: 10, padding: '0 4px', height: 14, borderRadius: 2,
        background: on ? 'rgba(0,0,0,0.20)' : 'var(--bg-sunk)',
        color: 'inherit', display: 'inline-flex', alignItems: 'center',
      }}>{count}</span>
    ) : null}
  </span>
);

/* ---------------------- Density segmented ---------------------- */
const DensitySeg = ({ value = 'M', onChange }) => (
  <div style={{
    display: 'inline-flex', padding: 2, borderRadius: 5,
    background: 'var(--bg-sunk)', border: '1px solid var(--border-2)',
  }}>
    {['S', 'M', 'L'].map(s => {
      const on = s === value;
      return (
        <button key={s} onClick={() => onChange && onChange(s)} style={{
          padding: '3px 9px', borderRadius: 3, border: 'none', cursor: 'pointer',
          background: on ? 'var(--bg-raised)' : 'transparent',
          color: on ? 'var(--ink-1)' : 'var(--ink-3)',
          fontFamily: 'var(--mono-font)', fontSize: 11, fontWeight: 600,
        }}>{s}</button>
      );
    })}
  </div>
);

/* ---------------------- Grid toolbar ---------------------- */
const GridToolbar = ({ density = 'M', filter = 'all', flagCounts = {} }) => {
  const totalFlagged = Object.values(flagCounts).reduce((a, b) => a + b, 0);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px',
      background: 'var(--bg-page)',
      border: '1px solid var(--border-1)',
      borderRadius: 8,
    }}>
      <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>
        <span className="mono" style={{ color: 'var(--ink-1)', fontWeight: 600 }}>387</span> pages
      </span>
      <Divider vertical style={{ height: 16 }} />

      <FilterChip on={filter === 'all'}>All</FilterChip>
      <FilterChip on={filter === 'flagged'} count={totalFlagged}>Flagged</FilterChip>
      <FilterChip on={filter === 'clean'}>Clean</FilterChip>

      <Divider vertical style={{ height: 16 }} />

      {/* Per-flag chips */}
      <FilterChip tone={CROP_FLAGS.cropped.tone}    count={flagCounts.cropped || 0}    on={filter === 'cropped'}>over-crop</FilterChip>
      <FilterChip tone={CROP_FLAGS.asymmetric.tone} count={flagCounts.asymmetric || 0} on={filter === 'asymmetric'}>asymmetric</FilterChip>
      <FilterChip tone={CROP_FLAGS.overflow.tone}   count={flagCounts.overflow || 0}   on={filter === 'overflow'}>overflow</FilterChip>
      <FilterChip tone={CROP_FLAGS.deskewFail.tone} count={flagCounts.deskewFail || 0} on={filter === 'deskewFail'}>deskew·fail</FilterChip>

      <div style={{ flex: 1 }} />

      <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>density</span>
      <DensitySeg value={density} />

      <Divider vertical style={{ height: 16 }} />

      <Button variant="default" size="sm" iconRight="chevD">Sort: index</Button>
    </div>
  );
};

/* ---------------------- The grid itself ---------------------- */
const CropsGrid = ({ rows = CROP_ROWS, density = 'M', selected = [], hoverIdx, focusIdx, filter }) => {
  const cfg = DENSITY_CFG[density];
  let visible = rows;
  if (filter === 'flagged') visible = rows.filter(r => r.flags);
  else if (filter === 'clean') visible = rows.filter(r => !r.flags);
  else if (filter && CROP_FLAGS[filter]) visible = rows.filter(r => r.flags && r.flags.includes(filter));
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cfg.col}, 1fr)`,
      gap: cfg.gap,
    }}>
      {visible.map(r => (
        <CropThumb key={r.prefix} row={r} density={density}
          selected={selected.includes(r.prefix)}
          hovered={hoverIdx === r.prefix}
          focused={focusIdx === r.prefix}
          dim={filter && filter !== 'all' && !visible.includes(r)}
        />
      ))}
    </div>
  );
};

/* ---------------------- Sticky bulk action bar ---------------------- */
const BulkActionBar = ({ count = 0, flagSummary }) => {
  if (!count) return null;
  return (
    <div style={{
      position: 'absolute', left: 24, right: 24, bottom: 16,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-2)',
      borderRadius: 8,
      boxShadow: 'var(--shadow-floating)',
      padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      zIndex: 20,
    }}>
      <Badge tone="brand">{count} selected</Badge>
      {flagSummary ? (
        <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
          {flagSummary}
        </span>
      ) : null}
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 10.5, color: 'var(--ink-4)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <KeyCap>Shift</KeyCap>+<KeyCap>click</KeyCap> to range-select · <KeyCap>esc</KeyCap> to clear
      </span>
      <Button variant="ghost" size="sm">Clear</Button>
      <Button variant="default" size="sm" icon="refresh">Re-deskew only</Button>
      <Button variant="primary" size="sm" icon="refresh">Re-run from initial_crop ({count})</Button>
    </div>
  );
};

/* ---------------------- Page wrapper (no tabs — subpage of project) ---------------------- */
const CropsGridPage = ({ theme = 'dark', children, toolbar, bulkBar }) => (
  <div className="pgd" data-theme={theme} style={{
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    background: 'var(--bg-page)',
  }}>
    <TopNav />
    <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Breadcrumb + title */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-3)' }}>
          <span style={{ cursor: 'pointer' }}>Projects</span>
          <Icon name="chevR" size={11} />
          <span className="mono" style={{ color: 'var(--ink-2)', cursor: 'pointer' }}>belloc-survivals</span>
          <Icon name="chevR" size={11} />
          <span className="mono" style={{ color: 'var(--ink-1)' }}>crops</span>
        </div>
        <div style={{
          marginTop: 6, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--ink-1)' }}>
            Crop Review
          </h1>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>stage</span>
            <Badge tone="ocr" mono>canvas_map</Badge>
            <Button variant="ghost" size="sm" icon="chevL">Back to project</Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '12px 24px 24px', overflow: 'auto',
        display: 'flex', flexDirection: 'column', gap: 12 }}>
        {toolbar}
        {children}
      </div>

      {bulkBar}
    </main>
    <ServerFooter />
  </div>
);

/* ---------------------- Flag summary helper ---------------------- */
const flagCountsFor = (rows) => {
  const c = {};
  for (const r of rows) for (const f of (r.flags || [])) c[f] = (c[f] || 0) + 1;
  return c;
};

Object.assign(window, {
  CROP_FLAGS, CROP_ROWS, DENSITY_CFG, FlagPill, CropThumb,
  FilterChip, DensitySeg, GridToolbar, CropsGrid, BulkActionBar,
  CropsGridPage, flagCountsFor,
});
