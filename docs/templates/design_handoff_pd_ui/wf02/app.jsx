// app.jsx — design canvas for WF-02 Package Validation.

const { useState: useStW, useEffect: useEfW } = React;

function App() {
  const [theme, setTheme] = useStW(() => localStorage.getItem('pgd-theme') || 'dark');
  useEfW(() => localStorage.setItem('pgd-theme', theme), [theme]);

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
        title="pgdp-prep · WF-02 Package Validation"
        subtitle="Pre-flight check that gates the Download package CTA. The panel renders in the Pipeline tab's right column after build_package completes, in PASS · WARNINGS · ERRORS states. The card header keeps a stable identity; the summary banner + footer CTA adapt to severity."
        sectionGap={56}
      >
        {/* ============================== Final pattern ============================== */}
        <DCSection
          id="V"
          title="V · Validation panel — three primary states"
          subtitle="Shared layout: card header (rule version) → severity banner → toolbar (last run, Re-validate) → 8 check rows → footer CTA. Severity changes the banner tint, badge, footer buttons, and which rows expand by default."
        >
          <DCArtboard id="V1" label="PASS · all 8 checks green · download enabled" width={W} height={H}>
            <VariationFrame theme={theme} state="pass" />
          </DCArtboard>

          <DCArtboard id="V2" label="WARNINGS · 2 amber rows · download anyway" width={W} height={H}>
            <VariationFrame theme={theme} state="warn" />
          </DCArtboard>

          <DCArtboard id="V3" label="ERRORS · download disabled · Fix all CTA" width={W} height={H}>
            <VariationFrame theme={theme} state="error" />
          </DCArtboard>
        </DCSection>

        {/* ============================== Drill-down states ============================== */}
        <DCSection
          id="D"
          title="D · Expanded check rows — affected-page chips"
          subtitle="Each failing or warning row collapses by default; clicking it reveals the affected pages as monospace chips that link to the workbench. Two examples: an error row (1-bit depth) with the Fix automatically action, and a warning row (PNG &gt; 100 KB)."
        >
          <DCArtboard id="D1" label="ERRORS · depth row expanded · 3 pages" width={W} height={H}>
            <VariationFrame theme={theme} state="error" expandedCheck="depth" />
          </DCArtboard>

          <DCArtboard id="D2" label="WARNINGS · pngsize row expanded · 14 pages" width={W} height={H}>
            <VariationFrame theme={theme} state="warn" expandedCheck="pngsize" />
          </DCArtboard>
        </DCSection>

        {/* ============================== Running / progress ============================== */}
        <DCSection
          id="R"
          title="R · Running &amp; mid-fix states"
          subtitle="Validation runs server-side and can take a few seconds; the panel shows progress per check. After clicking Fix automatically the affected check flips to running and the package quietly rebuilds."
        >
          <DCArtboard id="R1" label="Validating · 4/8 checks done · row 5 running" width={W} height={H}>
            <VariationFrame theme={theme} state="running" leftPackageState="done" />
          </DCArtboard>

          <DCArtboard id="R2" label="Mid-fix · depth check re-running after Fix automatically" width={W} height={H}>
            <VariationFrame theme={theme} state="error" expandedCheck="depth" fixing="depth" />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
