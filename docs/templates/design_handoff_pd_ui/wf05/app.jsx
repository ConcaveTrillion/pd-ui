// app.jsx — WF-05 Hyphen-Join Workbench canvas.
// Two sections:
//   1. Per-book Hyphen Report (lives in Project Configure → Settings tab)
//   2. Global Settings library (replaces the textareas on /settings)

const { useState: useS5App, useEffect: useE5App } = React;

function App() {
  const [theme, setTheme] = useS5App(() => localStorage.getItem('pgd-theme') || 'dark');
  useE5App(() => localStorage.setItem('pgd-theme', theme), [theme]);

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

  // Project Configure pages are 1440x900 like the rest of the WFs.
  // Queue mode + library tabs get a touch more height since content is denser.
  const W = 1440, H = 1100;

  return (
    <>
      {themeToggle}
      <DesignCanvas
        title="WF-05 · Hyphen-Join Workbench"
        subtitle={
          'Two surfaces. (1) Per-book Hyphen Report — collapsible panel in Project Configure → Settings tab. ' +
          'Three list/decision UX variants + a mismatched-dash report. ' +
          '(2) Global Settings library — replaces the legacy textareas with structured tag-list (hyphens) and table (scannos) editors.'
        }
        sectionGap={56}
      >
        <DCSection
          id="Report"
          title="1 · Per-book Hyphen Report"
          subtitle="Three review surfaces in the recommended workflow order: confirm what was auto-joined, decide the undecideds, then resolve any mismatched-dash conflicts."
        >
          <DCArtboard id="V5" label="V5 ★ · Auto-joined validation · grouped by word" width={W} height={H}>
            <HyphenV5 theme={theme} />
          </DCArtboard>

          <DCArtboard id="V3" label="V3 ★ · Undecided · Queue mode · keyboard-driven" width={W} height={H}>
            <HyphenV3 theme={theme} />
          </DCArtboard>

          <DCArtboard id="V4" label="V4 · Mismatched dash report" width={W} height={H}>
            <HyphenV4 theme={theme} />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="Library"
          title="2 · Global Settings library"
          subtitle="Replaces the legacy /settings textareas. L1–L2 are the baseline tabs; L3–L7 explore a unified library shell with side-nav, provenance, a per-book → global promotion inbox, universal search, bulk editing, and first-run onboarding. L8 + L9 are the Import / Export dialogs that overlay L3 — L7's starter-pack flow is only for empty libraries; L8 is how you bring in additional rules anytime."
        >
          <DCArtboard id="L1" label="L1 · Baseline · Hyphen rules tab (4 tag-lists)" width={W} height={H}>
            <SettingsHyphens theme={theme} />
          </DCArtboard>

          <DCArtboard id="L2" label="L2 · Baseline · Scannos tab (find/replace table)" width={W} height={H}>
            <SettingsScannos theme={theme} />
          </DCArtboard>

          <DCArtboard id="L3" label="L3 ★ · Dual-pane shell · side-nav + provenance column" width={W} height={H}>
            <LibL3 theme={theme} />
          </DCArtboard>

          <DCArtboard id="L4" label="L4 ★ · Promotion inbox · per-book → global bridge" width={W} height={H}>
            <LibL4 theme={theme} />
          </DCArtboard>

          <DCArtboard id="L5" label="L5 · Universal search · ⌘K-style across all categories" width={W} height={H}>
            <LibL5 theme={theme} />
          </DCArtboard>

          <DCArtboard id="L6" label="L6 · Bulk editor · paste list + JSON diff preview" width={W} height={H}>
            <LibL6 theme={theme} />
          </DCArtboard>

          <DCArtboard id="L7" label="L7 · Empty state · first-run starter packs" width={W} height={H}>
            <LibL7 theme={theme} />
          </DCArtboard>

          <DCArtboard id="L8" label="L8 · Import dialog · file / paste / URL / starter · with diff" width={W} height={H}>
            <LibL8 theme={theme} />
          </DCArtboard>

          <DCArtboard id="L9" label="L9 · Export dialog · scope + format + live preview" width={W} height={H}>
            <LibL9 theme={theme} />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
