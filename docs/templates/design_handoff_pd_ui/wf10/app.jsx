// app.jsx — design canvas for WF-10 Batch Crop Review.

const { useState: useStCG, useEffect: useEfCG } = React;

function App() {
  const [theme, setTheme] = useStCG(() => localStorage.getItem('pgd-theme') || 'dark');
  useEfCG(() => localStorage.setItem('pgd-theme', theme), [theme]);

  const themeToggle = (
    <div style={{
      position: 'fixed', top: 12, right: 16, zIndex: 50,
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(21,21,27,0.85)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999,
      padding: '3px 4px', boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif', fontSize: 12.5,
    }}>
      {['light', 'dark'].map(t => (
        <button key={t} onClick={() => setTheme(t)} style={{
          border: 0, cursor: 'pointer',
          background: theme === t ? '#d6925a' : 'transparent',
          color: theme === t ? '#1a0f08' : '#b0b0b8',
          padding: '5px 12px', borderRadius: 999, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name={t === 'dark' ? 'moon' : 'sun'} size={13} />
          {t === 'dark' ? 'Dark' : 'Light'}
        </button>
      ))}
    </div>
  );

  const W = 1440, H = 900;

  return (
    <>
      {themeToggle}
      <DesignCanvas
        title="pgdp-prep · WF-10 Batch Crop Review"
        subtitle="Make the existing Crops Grid interactive: surface quality flags on the canvas_map thumbnails, allow multi-select with shift+click range, and offer bulk re-run from initial_crop. Density toggle (S/M/L) lets the user dial scan-speed vs. inspection. Below the grid: a sticky bulk action bar appears when ≥1 thumb is selected."
        sectionGap={56}
      >
        {/* ============== Density ============== */}
        <DCSection
          id="A"
          title="A · Grid densities — S · M · L"
          subtitle="Same grid, three densities. S favours wide scans (9 cols, dot-only flag indicators). M is the default (6 cols, abbreviated flag chips). L is for careful review (4 cols, full flag chips). Density persists per project."
        >
          <DCArtboard id="A1" label="1 · Medium · default density" width={W} height={H}>
            <GridIdleM />
          </DCArtboard>
          <DCArtboard id="A2" label="2 · Small · fast scan" width={W} height={H}>
            <GridIdleS />
          </DCArtboard>
          <DCArtboard id="A3" label="3 · Large · careful review" width={W} height={H}>
            <GridIdleL />
          </DCArtboard>
        </DCSection>

        {/* ============== Flags + filter ============== */}
        <DCSection
          id="F"
          title="F · Quality flags + filter"
          subtitle="Flag taxonomy: over-crop / asymmetric / overflow / deskew·fail / loose / blank / misaligned / near edge. Each flag is a tonal pill (top-right of thumb). Toolbar filter chips narrow by flag class; per-flag counts use mono tabular. Filtered-out cells hide rather than dim."
        >
          <DCArtboard id="F1" label="4 · hover thumb · checkbox appears · accent border" width={W} height={H}>
            <GridHover />
          </DCArtboard>
          <DCArtboard id="F2" label="5 · filter = flagged · 8 of 387" width={W} height={H}>
            <GridFiltered />
          </DCArtboard>
          <DCArtboard id="F3" label="6 · filter by 'over-crop' · L density" width={W} height={H}>
            <GridFlagCropped />
          </DCArtboard>
        </DCSection>

        {/* ============== Selection + bulk action ============== */}
        <DCSection
          id="B"
          title="B · Multi-select + bulk action bar"
          subtitle="Click thumbs to toggle, Shift+click to range-select. Sticky bottom bar shows: selection count, flag summary, Re-deskew-only (cheaper, just fixes rotation), Re-run from initial_crop (full re-crop). Keyboard hint on the right."
        >
          <DCArtboard id="B1" label="7 · 5 thumbs selected · bulk bar visible" width={W} height={H}>
            <GridSelected />
          </DCArtboard>
          <DCArtboard id="B2" label="8 · range-select · filter=flagged · 7 selected" width={W} height={H}>
            <GridSelectedRange />
          </DCArtboard>
        </DCSection>

        {/* ============== Inline bbox editor (open design Q) ============== */}
        <DCSection
          id="E"
          title="E · Inline crop-bbox edit (open design question)"
          subtitle="The brief asks: should the grid support a 'crop only' mode where the user can drag the crop bbox directly on the thumbnail? Sketch: clicking a flagged thumb expands an inline panel with a magnified page, current bbox in red, draggable proposed bbox in accent, side panel for margin inputs + apply-to scope (this page / selected / all flagged-with-same-issue). No round-trip to the workbench."
        >
          <DCArtboard id="E1" label="9 · inline bbox editor on p019 · apply-to scope" width={W} height={H}>
            <GridBboxEditor />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
