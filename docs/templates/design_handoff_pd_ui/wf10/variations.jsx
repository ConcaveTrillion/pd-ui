// variations.jsx — WF-10 Batch Crop Review · artboard wrappers.

const flagCounts = flagCountsFor(CROP_ROWS);

/* A1: idle medium grid */
const GridIdleM = () => (
  <CropsGridPage toolbar={<GridToolbar density="M" filter="all" flagCounts={flagCounts} />}>
    <CropsGrid density="M" filter="all" />
  </CropsGridPage>
);

/* A2: idle small grid (denser) */
const GridIdleS = () => (
  <CropsGridPage toolbar={<GridToolbar density="S" filter="all" flagCounts={flagCounts} />}>
    <CropsGrid density="S" filter="all" />
  </CropsGridPage>
);

/* A3: idle large grid (review-focused) */
const GridIdleL = () => (
  <CropsGridPage toolbar={<GridToolbar density="L" filter="all" flagCounts={flagCounts} />}>
    <CropsGrid density="L" filter="all" />
  </CropsGridPage>
);

/* B1: hover one thumb — checkbox appears */
const GridHover = () => (
  <CropsGridPage toolbar={<GridToolbar density="M" filter="all" flagCounts={flagCounts} />}>
    <CropsGrid density="M" filter="all" hoverIdx="p019" focusIdx="p019" />
  </CropsGridPage>
);

/* B2: filter active — only flagged pages */
const GridFiltered = () => (
  <CropsGridPage toolbar={<GridToolbar density="M" filter="flagged" flagCounts={flagCounts} />}>
    <CropsGrid density="M" filter="flagged" />
  </CropsGridPage>
);

/* B3: filter by specific flag (over-crop) */
const GridFlagCropped = () => (
  <CropsGridPage toolbar={<GridToolbar density="L" filter="cropped" flagCounts={flagCounts} />}>
    <CropsGrid density="L" filter="cropped" />
  </CropsGridPage>
);

/* C1: multi-selection — bulk action bar visible */
const GridSelected = () => {
  const sel = ['p015', 'p019', 'p028', 'p031', 'p038'];
  return (
    <CropsGridPage
      toolbar={<GridToolbar density="M" filter="all" flagCounts={flagCounts} />}
      bulkBar={<BulkActionBar count={sel.length}
        flagSummary="2 over-crop · 1 deskew·fail · 1 overflow · 1 asymmetric" />}
    >
      <CropsGrid density="M" filter="all" selected={sel} />
    </CropsGridPage>
  );
};

/* C2: range-selected across flagged — denser view */
const GridSelectedRange = () => {
  const sel = ['p019', 'p024', 'p028', 'p031', 'p035', 'p038', 'p042'];
  return (
    <CropsGridPage
      toolbar={<GridToolbar density="M" filter="flagged" flagCounts={flagCounts} />}
      bulkBar={<BulkActionBar count={sel.length}
        flagSummary="7 selected — all flagged · re-cropping will fix 5" />}
    >
      <CropsGrid density="M" filter="flagged" selected={sel} />
    </CropsGridPage>
  );
};

/* D1: inline crop-bbox draw mode (open design question) ---------------- */
const CropBboxEditor = () => (
  <div style={{
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-2)',
    borderRadius: 8,
    padding: 16,
    display: 'grid',
    gridTemplateColumns: '480px 1fr',
    gap: 18,
  }}>
    {/* Magnified page */}
    <div style={{
      position: 'relative', aspectRatio: '0.78',
      background: '#fbf9f4', borderRadius: 4,
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        position: 'absolute', inset: '7% 11%',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 6px, rgba(58,44,28,0.6) 6px 7px, transparent 7px 12px)',
      }} />
      <div style={{
        position: 'absolute', left: '40%', right: '40%', bottom: 24, height: 5,
        background: 'rgba(58,44,28,0.7)',
      }} />
      {/* current bbox (off — too tight) */}
      <div style={{
        position: 'absolute', top: '14%', left: '8%', right: '24%', bottom: '14%',
        border: '2px dashed var(--mismatch)', borderRadius: 2,
      }}>
        <span style={{
          position: 'absolute', top: -12, left: -1, padding: '0 6px', height: 16,
          background: 'var(--mismatch)', color: '#fff',
          fontSize: 9.5, fontWeight: 700, fontFamily: 'var(--mono-font)',
          letterSpacing: '0.04em', borderRadius: 2,
          display: 'inline-flex', alignItems: 'center',
        }}>CURRENT · over-crop</span>
      </div>
      {/* proposed new bbox */}
      <div style={{
        position: 'absolute', top: '6%', left: '6%', right: '6%', bottom: '6%',
        border: '2px solid var(--accent)', borderRadius: 2,
      }}>
        <span style={{
          position: 'absolute', top: -12, right: -1, padding: '0 6px', height: 16,
          background: 'var(--accent)', color: 'var(--accent-ink)',
          fontSize: 9.5, fontWeight: 700, fontFamily: 'var(--mono-font)',
          letterSpacing: '0.04em', borderRadius: 2,
          display: 'inline-flex', alignItems: 'center',
        }}>PROPOSED</span>
        {/* corner handles */}
        {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([x,y]) => (
          <span key={`${x},${y}`} style={{
            position: 'absolute',
            top: y < 0 ? -4 : 'auto', bottom: y > 0 ? -4 : 'auto',
            left: x < 0 ? -4 : 'auto', right: x > 0 ? -4 : 'auto',
            width: 8, height: 8, background: 'var(--accent)',
            border: '1px solid var(--bg-surface)', borderRadius: 1,
          }} />
        ))}
      </div>
    </div>

    {/* Side controls */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
      <div>
        <div className="label">Page</div>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="mono" style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-1)' }}>p019</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>idx 17 of 387</span>
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 5 }}>
          <FlagPill kind="cropped" />
          <FlagPill kind="nearEdge" />
        </div>
      </div>

      <Divider />

      <div>
        <div className="label">Crop bbox</div>
        <div style={{
          marginTop: 6,
          display: 'grid', gridTemplateColumns: '32px 1fr 32px 1fr', gap: '4px 8px',
          alignItems: 'center', fontSize: 11,
        }}>
          {[['top','6%'],['left','6%'],['right','6%'],['bottom','6%']].flatMap(([k,v]) => [
            <span key={`l-${k}`} className="mono" style={{ color: 'var(--ink-3)' }}>{k}</span>,
            <Input key={`i-${k}`} value={v} mono style={{ height: 26 }} />,
          ])}
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
          <Button size="sm" variant="default">Reset to auto</Button>
          <Button size="sm" variant="default">Copy ◀ neighbour</Button>
        </div>
      </div>

      <Divider />

      <div>
        <div className="label">Apply to</div>
        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            ['This page', true,  'p019'],
            ['Selected (5)', false, 'p015 · p019 · p028 · p031 · p038'],
            ['All over-crop flagged (2)', false, 'p019 · p038'],
          ].map(([label, on, sub]) => (
            <label key={label} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 8px', borderRadius: 4, cursor: 'pointer',
              background: on ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
              border: on ? '1px solid color-mix(in srgb, var(--accent) 40%, transparent)' : '1px solid transparent',
            }}>
              <span style={{
                width: 12, height: 12, borderRadius: 99,
                border: on ? 'none' : '1px solid var(--border-2)',
                background: on ? 'var(--accent)' : 'var(--bg-sunk)',
                display: 'grid', placeItems: 'center',
              }}>
                {on ? <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent-ink)' }} /> : null}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--ink-1)', fontWeight: on ? 600 : 500 }}>{label}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 1 }}>{sub}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <Button size="md" variant="ghost">Open workbench</Button>
        <Button size="md" variant="primary" icon="check">Apply &amp; re-run</Button>
      </div>
    </div>
  </div>
);

const GridBboxEditor = () => (
  <CropsGridPage toolbar={<GridToolbar density="M" filter="cropped" flagCounts={flagCounts} />}>
    <CropBboxEditor />
  </CropsGridPage>
);

Object.assign(window, {
  GridIdleS, GridIdleM, GridIdleL,
  GridHover, GridFiltered, GridFlagCropped,
  GridSelected, GridSelectedRange,
  CropBboxEditor, GridBboxEditor,
});
